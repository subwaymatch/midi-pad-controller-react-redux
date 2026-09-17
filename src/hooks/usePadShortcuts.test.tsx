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
    const input = document.createElement("input");
    document.body.append(input);

    const event = press("q", {}, input);

    expect(onTrigger).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
    input.remove();
  });

  it("stops listening once unmounted", () => {
    const onTrigger = vi.fn();
    const { unmount } = renderHook(() => usePadShortcuts(DEFAULT_PADS, onTrigger));

    unmount();
    press("q");

    expect(onTrigger).not.toHaveBeenCalled();
  });
});
