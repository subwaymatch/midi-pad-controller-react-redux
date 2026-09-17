import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it } from "vitest";
import { makeStore } from "@/store";
import { setMediaQueryMatcher } from "@/test/browser";
import { MidiPad } from "./MidiPad";

function renderApp() {
  const store = makeStore();
  render(
    <Provider store={store}>
      <MidiPad />
    </Provider>,
  );
  return store;
}

beforeEach(() => {
  // Wide enough for the editor to be a side panel rather than a modal.
  setMediaQueryMatcher(() => false);
});

describe("MidiPad", () => {
  it("hands focus back to the pad's edit button when the editor closes", () => {
    const store = renderApp();
    const editButton = screen.getByRole("button", { name: "Edit pad V: Cowbell 808" });
    editButton.focus();

    fireEvent.click(editButton);
    expect(store.getState().editor?.padIndex).toBe(15);
    expect(screen.getByRole("dialog")).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(store.getState().editor).toBeNull();
    // Without this, a keyboard user lands back on <body> and has to tab in
    // from the top of the page again.
    expect(editButton).toHaveFocus();
  });

  it("turns pad presses into edits while edit mode is on", () => {
    const store = renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Edit pads" }));
    expect(store.getState().editMode).toBe(true);

    const pad = screen.getByRole("button", { name: /^Cowbell/ });
    fireEvent.pointerDown(pad, { button: 0 });
    fireEvent.click(pad, { detail: 1 });

    expect(store.getState().editor?.padIndex).toBe(15);
  });

  it("closes the editor when edit mode is switched off", () => {
    const store = renderApp();
    const toggle = screen.getByRole("button", { name: "Edit pads" });

    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole("button", { name: /^Cowbell/ }));
    expect(store.getState().editor).not.toBeNull();

    fireEvent.click(toggle);

    expect(store.getState().editMode).toBe(false);
    expect(store.getState().editor).toBeNull();
  });

  it("mutes and restores the volume from the speaker icon", () => {
    const store = renderApp();
    const mute = screen.getByRole("button", { name: "Mute" });

    fireEvent.click(mute);
    expect(store.getState().volume).toBe(0);
    expect(mute).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(mute);
    expect(store.getState().volume).toBe(0.8);
  });

  it("confirms a reset in the panel rather than through window.confirm", () => {
    const store = renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Edit pad V: Cowbell 808" }));
    fireEvent.click(screen.getByRole("radio", { name: "Magenta" }));
    expect(store.getState().pads[15]!.color).toBe("magenta");

    fireEvent.click(screen.getByRole("button", { name: "Help" }));
    fireEvent.click(screen.getByRole("button", { name: /Reset to defaults/ }));

    // Nothing happens until the second, explicit press: some in-app browsers
    // suppress window.confirm(), which used to make resetting impossible.
    expect(store.getState().pads[15]!.color).toBe("magenta");

    fireEvent.click(screen.getByRole("button", { name: "Reset everything" }));

    expect(store.getState().pads[15]!.color).toBe("turquoise");
    expect(store.getState().editor).toBeNull();
  });
});
