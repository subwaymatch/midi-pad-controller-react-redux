import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PADS } from "@/data/defaultPads";
import { usePadShortcuts } from "./usePadShortcuts";

function press(key: string, init: KeyboardEventInit = {}, target: EventTarget = window) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
}

describe("usePadShortcuts", () => {
  it("triggers the pad bound to the key, ignoring letter case", () => {
    const onTrigger = vi.fn();
    renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    const event = press("Q");

    expect(onTrigger).toHaveBeenCalledTimes(1);
    expect(onTrigger).toHaveBeenCalledWith(4);
    expect(event.defaultPrevented).toBe(true);
  });

  it("ignores unbound keys, auto-repeat and modifier chords", () => {
    const onTrigger = vi.fn();
    renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    press("p");
    press("q", { repeat: true });
    press("q", { ctrlKey: true });
    press("q", { metaKey: true });
    press("q", { altKey: true });

    expect(onTrigger).not.toHaveBeenCalled();
  });

  it("leaves keystrokes aimed at text fields alone", () => {
    const onTrigger = vi.fn();
    renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    for (const type of ["text", "search", "password", "number", "date"]) {
      const input = document.createElement("input");
      input.type = type;
      document.body.append(input);

      const event = press("q", {}, input);

      expect(onTrigger).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
      input.remove();
    }
  });

  it("still fires while a slider or a swatch has focus", () => {
    const onTrigger = vi.fn();
    renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    for (const type of ["range", "radio", "checkbox", "button"]) {
      const input = document.createElement("input");
      input.type = type;
      document.body.append(input);

      const event = press("q", {}, input);

      expect(event.defaultPrevented).toBe(true);
      input.remove();
    }

    expect(onTrigger).toHaveBeenCalledTimes(4);
    expect(onTrigger).toHaveBeenCalledWith(4);
  });

  it("falls back to the physical key on layouts without Latin characters", () => {
    const onTrigger = vi.fn();
    renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    press("\u0439", { code: "KeyQ" });
    press("\u0444", { code: "KeyA" });

    expect(onTrigger).toHaveBeenNthCalledWith(1, 4);
    expect(onTrigger).toHaveBeenNthCalledWith(2, 8);
  });

  it("prefers the typed character over the physical key", () => {
    const onTrigger = vi.fn();
    renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    // AZERTY: the key at the QWERTY "Q" position types an "a".
    press("a", { code: "KeyQ" });

    expect(onTrigger).toHaveBeenCalledExactlyOnceWith(8);
  });

  it("stops listening once unmounted", () => {
    const onTrigger = vi.fn();
    const { unmount } = renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    unmount();
    press("q");

    expect(onTrigger).not.toHaveBeenCalled();
  });
});
