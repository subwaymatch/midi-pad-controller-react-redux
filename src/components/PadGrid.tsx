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
  const editMode = useAppSelector((state) => state.editMode);
  const hydrated = useAppSelector((state) => state.hydrated);
  const dispatch = useAppDispatch();

  // Pads hit from the keyboard light up briefly, mirroring the :active state
  // that a pointer press gets for free.
  const [litPads, setLitPads] = useState<ReadonlySet<number>>(() => new Set());
  const flashTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Held so focus can go back to the edit button once the editor closes.
  const editButtons = useRef(new Map<number, HTMLButtonElement>());
  const previousEditing = useRef<number | null>(null);

  useEffect(() => {
    // Preloading the default layout before the saved one has been read would
    // fetch a sample for every pad the user has since changed, and throw it
    // away a tick later.
    if (!hydrated) return;
    for (const pad of pads) {
      player.preload(sampleUrl(pad.srcName));
    }
  }, [pads, player, hydrated]);

  useEffect(() => {
    const closed = previousEditing.current;
    previousEditing.current = editingIndex;
    if (editingIndex !== null || closed === null) return;
    // Only when the editor left focus stranded on the body. Closing as a side
    // effect of something else, a reset from the help panel say, must not pull
    // focus away from whatever the user is actually using.
    const active = document.activeElement;
    if (active && active !== document.body) return;
    editButtons.current.get(closed)?.focus();
  }, [editingIndex]);

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
          editMode={editMode}
          onPlay={() => play(index)}
          onEdit={() => openEditor(index)}
          editButtonRef={(element) => {
            if (element) editButtons.current.set(index, element);
            else editButtons.current.delete(index);
          }}
        />
      ))}
    </div>
  );
}
