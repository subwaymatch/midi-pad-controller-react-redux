"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePadShortcuts } from "@/hooks/usePadShortcuts";
import type { SamplePlayer } from "@/lib/audio/SamplePlayer";
import { sampleUrl } from "@/lib/samples";
import { editorOpened } from "@/store/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PadButton } from "./PadButton";
import styles from "./PadGrid.module.css";

/** How long a pad stays lit after a keyboard hit. */
const KEY_FLASH_MS = 120;

export function PadGrid({ player }: { player: SamplePlayer }) {
  const pads = useAppSelector((state) => state.pads);
  const editingIndex = useAppSelector((state) => state.editor?.padIndex ?? null);
  const dispatch = useAppDispatch();

  // Pads hit from the keyboard light up briefly, mirroring the :active state
  // that a pointer press gets for free.
  const [litPads, setLitPads] = useState<ReadonlySet<number>>(() => new Set());
  const flashTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    for (const pad of pads) {
      player.preload(sampleUrl(pad.srcName));
    }
  }, [pads, player]);

  useEffect(() => {
    const timers = flashTimers.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
    };
  }, []);

  const play = useCallback(
    (index: number) => {
      const pad = pads[index];
      if (!pad) return;
      player.play(sampleUrl(pad.srcName)).catch((error: unknown) => {
        console.error(`Could not play "${pad.srcName}"`, error);
      });
    },
    [pads, player],
  );

  const flash = useCallback((index: number) => {
    setLitPads((lit) => new Set(lit).add(index));

    const timers = flashTimers.current;
    clearTimeout(timers.get(index));
    timers.set(
      index,
      setTimeout(() => {
        timers.delete(index);
        setLitPads((lit) => {
          const next = new Set(lit);
          next.delete(index);
          return next;
        });
      }, KEY_FLASH_MS),
    );
  }, []);

  const triggerFromKeyboard = useCallback(
    (index: number) => {
      play(index);
      flash(index);
    },
    [play, flash],
  );

  usePadShortcuts(pads, triggerFromKeyboard);

  const openEditor = (index: number) => {
    const pad = pads[index];
    if (!pad) return;
    dispatch(
      editorOpened({
        padIndex: index,
        originalColor: pad.color,
        originalSrcName: pad.srcName,
      }),
    );
  };

  return (
    <div className={styles.grid} role="group" aria-label="Drum pads">
      {pads.map((pad, index) => (
        <PadButton
          key={index}
          pad={pad}
          isLit={litPads.has(index)}
          isEditing={editingIndex === index}
          onPlay={() => play(index)}
          onEdit={() => openEditor(index)}
        />
      ))}
    </div>
  );
}
