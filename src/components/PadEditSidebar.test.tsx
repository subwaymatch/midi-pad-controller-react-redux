import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SamplePlayer } from "@/lib/audio/SamplePlayer";
import { makeStore } from "@/store";
import { editorOpened, type EditorState } from "@/store/editorSlice";
import { setMediaQueryMatcher } from "@/test/browser";
import { PadEditSidebar } from "./PadEditSidebar";

const player = { play: vi.fn(async () => {}) } as unknown as SamplePlayer;

/** Pad 4 of the default layout: "Snare Acoustic01" on key Q, in blue. */
const EDITOR: EditorState = {
  padIndex: 4,
  originalColor: "blue",
  originalSrcName: "Snare Acoustic01",
};

function renderEditor({ overlay }: { overlay: boolean }) {
  // Below 900px the panel is over the pads; above it, beside them.
  setMediaQueryMatcher(() => overlay);
  const store = makeStore();
  store.dispatch(editorOpened(EDITOR));

  const { container } = render(
    <Provider store={store}>
      <PadEditSidebar editor={EDITOR} player={player} />
    </Provider>,
  );

  return { store, dialog: container.querySelector("dialog")! };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PadEditSidebar", () => {
  it("is modal where it covers the pads, so they cannot be played through it", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const show = vi.spyOn(HTMLDialogElement.prototype, "show");

    const { dialog } = renderEditor({ overlay: true });

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(show).not.toHaveBeenCalled();
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveFocus();
  });

  it("is a plain side panel where there is room beside the pads", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const show = vi.spyOn(HTMLDialogElement.prototype, "show");

    renderEditor({ overlay: false });

    expect(show).toHaveBeenCalledTimes(1);
    expect(showModal).not.toHaveBeenCalled();
  });

  it("closes on Escape while modal", () => {
    const { store } = renderEditor({ overlay: true });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(store.getState().editor).toBeNull();
  });

  it("closes on Escape as a side panel too", () => {
    const { store, dialog } = renderEditor({ overlay: false });

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(store.getState().editor).toBeNull();
  });

  it("closes when the backdrop is tapped, but not the panel itself", () => {
    const { store, dialog } = renderEditor({ overlay: true });

    fireEvent.click(screen.getByRole("heading", { name: "Pad Q" }));
    expect(store.getState().editor).not.toBeNull();

    // A click on the backdrop is reported against the dialog element.
    fireEvent.click(dialog);
    expect(store.getState().editor).toBeNull();
  });

  it("closes from the Close button", () => {
    const { store } = renderEditor({ overlay: true });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(store.getState().editor).toBeNull();
  });

  it("previews the pad being edited, which the panel usually covers", () => {
    const { store } = renderEditor({ overlay: true });

    const preview = screen.getByText("Snare");
    expect(preview).toHaveStyle({ "--pad": "#0097f0" });

    fireEvent.click(screen.getByRole("radio", { name: "Orange" }));

    expect(store.getState().pads[4]!.color).toBe("orange");
    expect(preview).toHaveStyle({ "--pad": "#e64c00" });
  });

  it("scrolls the sample list without scrolling the page", () => {
    // scrollIntoView() walks up every scrollable ancestor, the document
    // included, which drags the top bar off screen.
    // jsdom has no scrollIntoView at all, so one is added just to watch for it.
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    try {
      renderEditor({ overlay: false });
      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(Element.prototype, "scrollIntoView");
    }
  });

  it("plays a sample when it is picked", () => {
    const { store } = renderEditor({ overlay: false });

    fireEvent.click(screen.getByRole("button", { name: /^Clap 808/ }));

    expect(store.getState().pads[4]!.srcName).toBe("Clap 808");
    expect(player.play).toHaveBeenCalledWith(expect.stringContaining("clap-808.wav"));
  });
});
