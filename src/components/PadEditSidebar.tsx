"use client";

import { useCallback, useLayoutEffect, useRef, type CSSProperties, type MouseEvent, type KeyboardEvent } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { SamplePlayer } from "@/lib/audio/SamplePlayer";
import { padColorHex, padColorLabel, padLabelHex, type PadColor } from "@/lib/colors";
import { cx } from "@/lib/cx";
import { SAMPLE_NAMES, sampleUrl, shortSampleName } from "@/lib/samples";
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

/** Below this width the panel covers the pads rather than sitting beside them. */
const COVERS_THE_PADS = "(max-width: 899px)";

export function PadEditSidebar({ editor, player }: PadEditSidebarProps) {
  const { padIndex, originalColor, originalSrcName } = editor;
  const pad = useAppSelector((state) => state.pads[padIndex]);
  const dispatch = useAppDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const isOverlay = useMediaQuery(COVERS_THE_PADS);

  const close = useCallback(() => dispatch(editorClosed()), [dispatch]);

  // Modal whenever the panel is over the pads. That is what makes the covered
  // pads inert instead of leaving a live strip beside the panel, and it brings
  // a backdrop, a focus trap and Escape with it. On a wide screen the panel
  // sits beside the pads and they stay playable, so it opens non-modally.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOverlay) dialog.showModal();
    else dialog.show();
    dialog.focus({ preventScroll: true });
    return () => dialog.close();
  }, [isOverlay]);

  // Bring the current sample into view by scrolling the list alone.
  // scrollIntoView() would scroll every scrollable ancestor, the document
  // included, which drags the top bar off screen.
  useLayoutEffect(() => {
    const list = listRef.current;
    const item = selectedRef.current;
    if (!list || !item) return;
    list.scrollTop =
      item.offsetTop - list.offsetTop - (list.clientHeight - item.offsetHeight) / 2;
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

  // A click on the backdrop is reported against the dialog itself.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    // A modal dialog already closes itself on Escape, via onCancel below.
    if (!isOverlay && event.key === "Escape") close();
  };

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className={styles.dialog}
      aria-label={`Edit pad ${key}`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          {/* The pad itself is usually hidden behind the panel on a phone, so
              the colour being picked is previewed here. */}
          <span
            className={styles.preview}
            style={
              {
                "--pad": padColorHex(pad.color),
                "--pad-label": padLabelHex(pad.color),
              } as CSSProperties
            }
            aria-hidden="true"
          >
            {shortSampleName(pad.srcName)}
          </span>
          <h2 className={styles.heading}>Pad {key}</h2>
        </div>

        <section className={cx(styles.section, styles.colors)}>
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
          <ul ref={listRef} className={styles.sampleList}>
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

        <div className={styles.closeBar}>
          <button type="button" className={styles.closeButton} onClick={close}>
            <Icon name="close" />
            Close
          </button>
        </div>
      </div>
    </dialog>
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
