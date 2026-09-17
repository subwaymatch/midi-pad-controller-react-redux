"use client";

import { useEffect } from "react";
import { useSamplePlayer } from "@/hooks/useSamplePlayer";
import { useAppSelector } from "@/store/hooks";
import { MidiControls } from "./MidiControls";
import { PadEditSidebar } from "./PadEditSidebar";
import { PadGrid } from "./PadGrid";
import styles from "./MidiPad.module.css";

export function MidiPad() {
  const volume = useAppSelector((state) => state.volume);
  const editor = useAppSelector((state) => state.editor);
  const player = useSamplePlayer(volume);

  // Browsers keep audio muted until the first user gesture. Unlocking on the
  // very first pointer or key event, wherever it lands, gets the samples
  // decoded before the first real hit.
  useEffect(() => {
    function unlock() {
      player.unlock().catch(() => {});
      stopListening();
    }
    function stopListening() {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    }
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return stopListening;
  }, [player]);

  return (
    <div className={styles.app}>
      <main className={styles.stage}>
        <MidiControls />
        <PadGrid player={player} />
      </main>

      {editor && (
        <PadEditSidebar key={editor.padIndex} editor={editor} player={player} />
      )}
    </div>
  );
}
