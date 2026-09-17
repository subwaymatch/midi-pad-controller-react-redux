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

  // Fallback for layouts that do not produce Latin characters at all (Cyrillic,
  // Greek, ...), where `event.key` never matches a shortcut. Matching the
  // physical key keeps the 4x4 block playable there. Latin layouts are still
  // matched by character first, so the letters printed on the pads stay true
  // to the keys that trigger them on AZERTY, Dvorak and friends.
  const indexByCode = useMemo(
    () => new Map(pads.map((pad, index) => [keyCode(pad.shortcutKey), index])),
    [pads],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntryTarget(event.target)) return;

      const index = indexByKey.get(event.key.toLowerCase()) ?? indexByCode.get(event.code);
      if (index === undefined) return;

      event.preventDefault();
      onTrigger(index);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [indexByKey, indexByCode, onTrigger]);
}

/** "q" -> "KeyQ", "1" -> "Digit1": the `KeyboardEvent.code` of a US key. */
function keyCode(shortcutKey: string): string {
  const key = shortcutKey.toLowerCase();
  if (/^[a-z]$/.test(key)) return `Key${key.toUpperCase()}`;
  if (/^[0-9]$/.test(key)) return `Digit${key}`;
  return key;
}

/**
 * Inputs that swallow a shortcut because the keystroke is meant to become
 * text. Sliders and checkable inputs are deliberately not on the list: they
 * are driven by the arrow keys, Home/End and Space, none of which collide
 * with a pad shortcut, so adjusting the volume mid-jam must not silence the
 * keyboard.
 */
const TEXT_INPUT_TYPES = new Set([
  "text",
  "search",
  "email",
  "url",
  "tel",
  "password",
  "number",
  "date",
  "datetime-local",
  "month",
  "time",
  "week",
]);

export function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return true;
  }
  return target instanceof HTMLInputElement && TEXT_INPUT_TYPES.has(target.type);
}
