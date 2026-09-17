"use client";

import { useEffect } from "react";
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
    <div className={styles.app}>
      {/* Reserving the panel's column only once it is open would shove the
          pads sideways, so the panel floats and the stage is padded with a
          transition. Above 1300px the centered grid never reaches it and no
          padding is needed at all. */}
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
