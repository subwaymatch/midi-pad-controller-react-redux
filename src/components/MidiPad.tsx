"use client";

import { useEffect, type MouseEvent } from "react";
import { useSamplePlayer } from "@/hooks/useSamplePlayer";
import { useAppSelector } from "@/store/hooks";
import { MidiControls } from "./MidiControls";
import { PadEditSidebar } from "./PadEditSidebar";
import { PadGrid } from "./PadGrid";
import styles from "./MidiPad.module.css";

/**
 * Events that may carry the user activation audio needs. Chromium unlocks on
 * `pointerdown`, but under the HTML activation model a touch `pointerdown` is
 * not an activation-triggering event, and WebKit has historically wanted
 * `touchend` or `click`, so all of them are listened for.
 */
const UNLOCK_EVENTS = [
  "pointerdown",
  "pointerup",
  "touchend",
  "click",
  "keydown",
] as const;

/**
 * Stops a pointer press from leaving focus on the button it hit.
 *
 * The keyboard is this app's instrument, not a way to move around it, and the
 * browser cannot tell the two apart: the first note played flips it into
 * keyboard mode, and `:focus-visible` then rings whatever the mouse last
 * clicked — a pad, its pencil, the Edit pads toggle — none of which is where
 * the keys are going. Declining the focus keeps the ring where it earns its
 * place: on a control reached by Tab, the only way to see where you are.
 * Inputs keep theirs, since a slider or a swatch has to hold focus to be
 * driven from the keyboard at all.
 */
export function keepFocusOffPressedButtons(event: MouseEvent<HTMLDivElement>) {
  if ((event.target as Element).closest("button")) event.preventDefault();
}

export function MidiPad() {
  const volume = useAppSelector((state) => state.volume);
  const editor = useAppSelector((state) => state.editor);
  const player = useSamplePlayer(volume);

  // Browsers keep audio muted until the first user gesture. Unlocking on the
  // first event, wherever it lands, gets the samples decoded before the first
  // real hit. The listeners stay until the context is genuinely running, so a
  // gesture that the browser did not accept cannot leave the app mute.
  useEffect(() => {
    function unlock() {
      player.unlock().then(stopWhenRunning, () => {});
    }
    function stopWhenRunning() {
      if (player.isRunning) stopListening();
    }
    function stopListening() {
      for (const type of UNLOCK_EVENTS) {
        window.removeEventListener(type, unlock);
      }
    }
    for (const type of UNLOCK_EVENTS) {
      window.addEventListener(type, unlock);
    }
    return stopListening;
  }, [player]);

  return (
    <div className={styles.app} onMouseDown={keepFocusOffPressedButtons}>
      {/* Reserving the panel's column only once it is open would shove the
          pads sideways, so the panel floats and the stage is padded with a
          transition. Above 1300px the centered grid never reaches it and the
          stage keeps its padding, but the top bar gives way at every width:
          its controls sit against the right edge, under the panel. */}
      <main className={styles.main} data-editing={editor !== null}>
        <h1 className="visually-hidden">MIDI Pad Controller</h1>
        <MidiControls />
        <div className={styles.stage}>
          <PadGrid player={player} />
        </div>
      </main>

      {editor && (
        <PadEditSidebar key={editor.padIndex} editor={editor} player={player} />
      )}
    </div>
  );
}
