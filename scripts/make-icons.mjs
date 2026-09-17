/**
 * Regenerates the PWA icons in `public/` with `npm run icons`.
 *
 * They are a flat 4x4 pad grid in the app's four default colors, written as
 * PNG by hand so the repository needs no image tooling to reproduce them.
 */
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

// The four pad colors of the default layout, one per grid column.
const COLUMNS = ["#0097f0", "#e64c00", "#d2d900", "#01c6bd"];
const BG = [17, 17, 17];
const SS = 4; // supersampling factor, for antialiased pad corners

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Draws the 4x4 pad grid, `inset` being the share of the canvas left empty. */
function render(size, inset) {
  const n = size * SS;
  const pads = COLUMNS.map(hex);
  const pixels = new Uint8Array(n * n * 3);
  for (let i = 0; i < pixels.length; i += 3) {
    pixels.set(BG, i);
  }

  const margin = n * inset;
  const span = n - 2 * margin;
  const gap = span * 0.07;
  const cell = (span - 3 * gap) / 4;
  const radius = cell * 0.18;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x0 = margin + col * (cell + gap);
      const y0 = margin + row * (cell + gap);
      const [r, g, b] = pads[col];
      // Rows fade slightly from top to bottom, echoing the pad gradient.
      const shade = 1 - row * 0.09;
      for (let y = Math.floor(y0); y < Math.ceil(y0 + cell); y++) {
        for (let x = Math.floor(x0); x < Math.ceil(x0 + cell); x++) {
          if (x < 0 || y < 0 || x >= n || y >= n) continue;
          // Round the corners: outside the inset rectangle, keep within radius.
          const dx = Math.max(x0 + radius - x, 0, x - (x0 + cell - radius));
          const dy = Math.max(y0 + radius - y, 0, y - (y0 + cell - radius));
          if (dx * dx + dy * dy > radius * radius) continue;
          const at = (y * n + x) * 3;
          pixels[at] = Math.round(r * shade);
          pixels[at + 1] = Math.round(g * shade);
          pixels[at + 2] = Math.round(b * shade);
        }
      }
    }
  }
  return downsample(pixels, n, size);
}

function downsample(pixels, n, size) {
  const out = new Uint8Array(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const at = ((y * SS + sy) * n + (x * SS + sx)) * 3;
          sum[0] += pixels[at];
          sum[1] += pixels[at + 1];
          sum[2] += pixels[at + 2];
        }
      }
      const at = (y * size + x) * 3;
      for (let c = 0; c < 3; c++) out[at + c] = Math.round(sum[c] / (SS * SS));
    }
  }
  return out;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, i) => {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(size, rgb) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor
  // Each scanline is prefixed with filter type 0 (none).
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    Buffer.from(rgb.buffer, y * size * 3, size * 3).copy(raw, y * (size * 3 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const OUT = process.argv[2] ?? "public";
for (const [name, size, inset] of [
  ["icon-192.png", 192, 0.1],
  ["icon-512.png", 512, 0.1],
  ["icon-maskable-512.png", 512, 0.2],
  ["apple-touch-icon.png", 180, 0.1],
]) {
  writeFileSync(`${OUT}/${name}`, png(size, render(size, inset)));
  console.log("wrote", name, size);
}
