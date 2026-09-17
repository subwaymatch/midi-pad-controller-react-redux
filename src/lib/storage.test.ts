import { describe, expect, it } from "vitest";
import { DEFAULT_PADS } from "@/data/defaultPads";
import {
  DEFAULT_VOLUME,
  loadPersistedState,
  sanitizePads,
  sanitizeVolume,
  savePads,
  saveVolume,
  STORAGE_KEYS,
} from "./storage";

describe("sanitizeVolume", () => {
  it.each([
    [undefined, DEFAULT_VOLUME],
    [null, DEFAULT_VOLUME],
    ["0.5", DEFAULT_VOLUME],
    [Number.NaN, DEFAULT_VOLUME],
    [-1, 0],
    [2, 1],
    [0.35, 0.35],
  ])("turns %s into %s", (input, expected) => {
    expect(sanitizeVolume(input)).toBe(expected);
  });
});

describe("sanitizePads", () => {
  it("returns the defaults for missing or malformed data", () => {
    expect(sanitizePads(undefined)).toEqual(DEFAULT_PADS);
    expect(sanitizePads("nope")).toEqual(DEFAULT_PADS);
    expect(sanitizePads([1, null, "x"])).toEqual(DEFAULT_PADS);
  });

  it("keeps valid entries and repairs invalid ones one by one", () => {
    const stored: unknown[] = DEFAULT_PADS.map((pad) => ({ ...pad }));
    stored[0] = { srcName: "Crash 808", shortcutKey: "1", color: "green" };
    stored[1] = { srcName: "Not A Sample", shortcutKey: "2", color: "hotpink" };
    stored[2] = { srcName: "Kick 808", shortcutKey: "3", color: "hotpink" };

    const result = sanitizePads(stored);

    expect(result).toHaveLength(DEFAULT_PADS.length);
    expect(result[0]).toEqual({ srcName: "Crash 808", shortcutKey: "1", color: "green" });
    expect(result[1]).toEqual(DEFAULT_PADS[1]);
    expect(result[2]).toEqual({ ...DEFAULT_PADS[2], srcName: "Kick 808" });
  });

  it("always uses the built-in shortcut keys", () => {
    const stored = DEFAULT_PADS.map((pad) => ({ ...pad, shortcutKey: "p" }));
    expect(sanitizePads(stored).map((pad) => pad.shortcutKey)).toEqual(
      DEFAULT_PADS.map((pad) => pad.shortcutKey),
    );
  });

  it("returns fresh objects, never the shared defaults", () => {
    const result = sanitizePads(undefined);
    expect(result[0]).not.toBe(DEFAULT_PADS[0]);
  });
});

describe("loadPersistedState", () => {
  it("falls back to the defaults when nothing is stored", () => {
    expect(loadPersistedState()).toEqual({ volume: DEFAULT_VOLUME, pads: DEFAULT_PADS });
  });

  it("survives corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEYS.pads, "{not json");
    localStorage.setItem(STORAGE_KEYS.volume, "[1");
    expect(loadPersistedState()).toEqual({ volume: DEFAULT_VOLUME, pads: DEFAULT_PADS });
  });

  it("round-trips what was saved", () => {
    const pads = sanitizePads(undefined);
    pads[3] = { ...pads[3]!, color: "magenta", srcName: "Snare 808" };
    saveVolume(0.25);
    savePads(pads);

    expect(loadPersistedState()).toEqual({ volume: 0.25, pads });
  });

  it("reads layouts saved by the original app", () => {
    // The 2019 version stored the same keys and shape; keep loading them.
    const legacy = DEFAULT_PADS.map((pad) => ({ ...pad }));
    legacy[15] = { srcName: "Tom Acoustic01", shortcutKey: "v", color: "green" };
    localStorage.setItem("padMappings", JSON.stringify(legacy));
    localStorage.setItem("volume", "0.6");

    expect(loadPersistedState()).toEqual({ volume: 0.6, pads: legacy });
  });
});
