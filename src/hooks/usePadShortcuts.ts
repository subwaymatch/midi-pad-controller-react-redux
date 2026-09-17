import { useEffect, useMemo } from "react";
import type { Pad } from "@/lib/pads";

/**
 * Triggers a pad when its shortcut key is pressed anywhere on the page.
 *
 * Held keys fire once (auto-repeat is ignored), chords with a modifier are
 * left to the browser, and keystrokes aimed at a text field are not hijacked.
 */
export function usePadShortcuts(
  pads: readonly Pad[],
  onTrigger: (index: number) => void,
): void {
  const indexByKey = useMemo(
    () => new Map(pads.map((pad, index) => [pad.shortcutKey.toLowerCase(), index])),
    [pads],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntryTarget(event.target)) return;

      const index = indexByKey.get(event.key.toLowerCase());
      if (index === undefined) return;

      event.preventDefault();
      onTrigger(index);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [indexByKey, onTrigger]);
}

export function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
