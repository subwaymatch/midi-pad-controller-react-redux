"use client";

import { useEffect, useRef } from "react";
import type { SamplePlayer } from "@/lib/audio/SamplePlayer";
import { padColorLabel, type PadColor } from "@/lib/colors";
import { cx } from "@/lib/cx";
import { SAMPLE_NAMES, sampleUrl } from "@/lib/samples";
import { editorClosed, type EditorState } from "@/store/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { padColorChanged, padSampleChanged } from "@/store/padsSlice";
import { ColorSwatches } from "./ColorSwatches";
import { Icon } from "./Icon";
import styles from "./PadEditSidebar.module.css";

interface PadEditSidebarProps {
  editor: EditorState;
  player: SamplePlayer;
}

export function PadEditSidebar({ editor, player }: PadEditSidebarProps) {
  const { padIndex, originalColor, originalSrcName } = editor;
  const pad = useAppSelector((state) => state.pads[padIndex]);
  const dispatch = useAppDispatch();
  const panelRef = useRef<HTMLElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // On open: move focus into the panel and bring the current sample into view.
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
    selectedRef.current?.scrollIntoView?.({ block: "center" });
  }, []);

  if (!pad) return null;

  const key = pad.shortcutKey.toUpperCase();

  const setColor = (color: PadColor) => {
    dispatch(padColorChanged({ index: padIndex, color }));
  };

  const setSample = (srcName: string) => {
    dispatch(padSampleChanged({ index: padIndex, srcName }));
  };

  const pickSample = (srcName: string) => {
    setSample(srcName);
    player.play(sampleUrl(srcName)).catch((error: unknown) => {
      console.error(`Could not play "${srcName}"`, error);
    });
  };

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      className={styles.sidebar}
      aria-label={`Edit pad ${key}`}
    >
      <h2 className={styles.heading}>Pad {key}</h2>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h3>Button color</h3>
          <span className={styles.colorName}>{padColorLabel(pad.color)}</span>
          {pad.color !== originalColor && (
            <RevertButton
              label={`Revert to ${padColorLabel(originalColor)}`}
              onClick={() => setColor(originalColor)}
            />
          )}
        </div>
        <ColorSwatches value={pad.color} onChange={setColor} />
      </section>

      <section className={cx(styles.section, styles.samples)}>
        <div className={styles.sectionTitle}>
          <h3>Audio source</h3>
          {pad.srcName !== originalSrcName && (
            <RevertButton
              label={`Revert to ${originalSrcName}`}
              onClick={() => setSample(originalSrcName)}
            />
          )}
        </div>
        <ul className={styles.sampleList}>
          {SAMPLE_NAMES.map((name) => {
            const selected = name === pad.srcName;
            return (
              <li key={name}>
                <button
                  type="button"
                  ref={selected ? selectedRef : undefined}
                  className={cx(styles.sampleItem, selected && styles.selected)}
                  aria-pressed={selected}
                  onClick={() => pickSample(name)}
                >
                  {name}
                  {selected && <Icon name="check" />}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        type="button"
        className={styles.closeButton}
        onClick={() => dispatch(editorClosed())}
      >
        <Icon name="close" />
        Close
      </button>
    </aside>
  );
}

function RevertButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.revert}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <Icon name="undo" />
      Revert
    </button>
  );
}
