import { describe, expect, it } from "vitest";
import { DEFAULT_PADS } from "@/data/defaultPads";
import { STORAGE_KEYS } from "@/lib/storage";
import { hydrateFromStorage } from "./actions";
import { editModeExited, editModeToggled } from "./editModeSlice";
import { editorClosed, editorOpened } from "./editorSlice";
import { makeStore } from "./index";
import { padColorChanged, padSampleChanged, padsReset } from "./padsSlice";
import { volumeChanged } from "./volumeSlice";

describe("pads", () => {
  it("changes one pad without touching the others or the previous state", () => {
    const store = makeStore();
    const before = store.getState().pads;

    store.dispatch(padColorChanged({ index: 2, color: "green" }));
    const after = store.getState().pads;

    expect(after[2]!.color).toBe("green");
    expect(before[2]!.color).toBe("lightgreen");
    expect(after[1]).toBe(before[1]);
  });

  it("ignores out-of-range indexes", () => {
    const store = makeStore();
    const before = store.getState().pads;

    store.dispatch(padColorChanged({ index: 99, color: "green" }));
    store.dispatch(padSampleChanged({ index: -1, srcName: "Clap 808" }));

    expect(store.getState().pads).toBe(before);
  });

  it("resets to the defaults, and edits after a reset leave the defaults intact", () => {
    // Regression: the original app handed out its default objects by reference
    // on reset, so the next edit silently rewrote the defaults themselves.
    const store = makeStore();
    store.dispatch(padColorChanged({ index: 0, color: "green" }));
    store.dispatch(padsReset());
    expect(store.getState().pads).toEqual(DEFAULT_PADS);

    store.dispatch(padSampleChanged({ index: 0, srcName: "Crash 808" }));
    expect(DEFAULT_PADS[0]!.srcName).toBe("Hihat Acoustic01");

    store.dispatch(padsReset());
    expect(store.getState().pads[0]).toEqual(DEFAULT_PADS[0]);
  });
});

describe("volume", () => {
  it("is clamped to the 0..1 range", () => {
    const store = makeStore();
    store.dispatch(volumeChanged(1.7));
    expect(store.getState().volume).toBe(1);
    store.dispatch(volumeChanged(-3));
    expect(store.getState().volume).toBe(0);
    store.dispatch(volumeChanged(0.4));
    expect(store.getState().volume).toBe(0.4);
  });
});

describe("editor", () => {
  it("opens with a snapshot of the pad and closes back to null", () => {
    const store = makeStore();
    const snapshot = { padIndex: 5, originalColor: "orange", originalSrcName: "Snare Acoustic02" } as const;

    store.dispatch(editorOpened(snapshot));
    expect(store.getState().editor).toEqual(snapshot);

    store.dispatch(editorClosed());
    expect(store.getState().editor).toBeNull();
  });
});

describe("persistence", () => {
  it("writes pads and volume to localStorage when they change", () => {
    const store = makeStore();

    store.dispatch(volumeChanged(0.5));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.volume)!)).toBe(0.5);

    store.dispatch(padColorChanged({ index: 1, color: "green" }));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.pads)!);
    expect(saved[1].color).toBe("green");
    expect(saved).toHaveLength(DEFAULT_PADS.length);
  });

  it("does not write when the layout did not change", () => {
    const store = makeStore();
    store.dispatch(editorOpened({ padIndex: 0, originalColor: "blue", originalSrcName: "Hihat Acoustic01" }));
    expect(localStorage.getItem(STORAGE_KEYS.pads)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.volume)).toBeNull();
  });

  it("applies state loaded from storage to every slice", () => {
    const store = makeStore();
    const pads = DEFAULT_PADS.map((pad) => ({ ...pad }));
    pads[0] = { ...pads[0]!, color: "magenta" };

    store.dispatch(hydrateFromStorage({ volume: 0.1, pads }));

    expect(store.getState().volume).toBe(0.1);
    expect(store.getState().pads[0]!.color).toBe("magenta");
  });
});

describe("editMode", () => {
  it("starts off and toggles", () => {
    const store = makeStore();
    expect(store.getState().editMode).toBe(false);

    store.dispatch(editModeToggled());
    expect(store.getState().editMode).toBe(true);

    store.dispatch(editModeExited());
    expect(store.getState().editMode).toBe(false);
  });
});

describe("hydrated", () => {
  it("stays false until the saved state arrives", () => {
    const store = makeStore();
    expect(store.getState().hydrated).toBe(false);

    store.dispatch(volumeChanged(0.5));
    expect(store.getState().hydrated).toBe(false);

    store.dispatch(hydrateFromStorage({ volume: 0.5, pads: [...DEFAULT_PADS] }));
    expect(store.getState().hydrated).toBe(true);
  });
});
