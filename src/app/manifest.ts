import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/basePath";

// Required for `output: "export"`: the manifest is generated at build time.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MIDI Pad Controller",
    short_name: "MIDI Pads",
    description: "A browser drum pad with 99 samples and keyboard shortcuts.",
    start_url: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#111111",
    theme_color: "#000000",
    icons: [
      {
        src: `${BASE_PATH}/favicon.ico`,
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      { src: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png" },
      {
        src: `${BASE_PATH}/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
