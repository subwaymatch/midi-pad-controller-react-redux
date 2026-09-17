import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PADS } from "@/data/defaultPads";
import type { SamplePlayer } from "@/lib/audio/SamplePlayer";
import { makeStore } from "@/store";
import { hydrateFromStorage } from "@/store/actions";
import { PadGrid } from "./PadGrid";

function renderGrid() {
  const preload = vi.fn();
  const player = { preload, play: vi.fn(async () => {}) } as unknown as SamplePlayer;
  const store = makeStore();

  render(
    <Provider store={store}>
      <PadGrid player={player} />
    </Provider>,
  );

  return {
    store,
    preloaded: () => preload.mock.calls.map(([url]) => String(url)),
  };
}

describe("PadGrid preloading", () => {
  it("fetches nothing until the saved layout has been read", () => {
    const { preloaded } = renderGrid();
    expect(preloaded()).toEqual([]);
  });

  it("never fetches a default sample the saved layout has replaced", () => {
    const { store, preloaded } = renderGrid();
    const saved = DEFAULT_PADS.map((pad, index) =>
      index === 0 ? { ...pad, srcName: "Crash Acoustic" } : { ...pad },
    );

    act(() => {
      store.dispatch(hydrateFromStorage({ volume: 0.8, pads: saved }));
    });

    const urls = preloaded();
    expect(urls).toHaveLength(16);
    expect(urls.some((url) => url.endsWith("crash-acoustic.wav"))).toBe(true);
    expect(urls.some((url) => url.endsWith("hihat-acoustic01.wav"))).toBe(false);
  });
});
