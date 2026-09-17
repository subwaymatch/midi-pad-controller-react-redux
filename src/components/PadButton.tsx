"use client";

import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import { padColorHex } from "@/lib/colors";
import { cx } from "@/lib/cx";
import type { Pad } from "@/lib/pads";
import { shortSampleName } from "@/lib/samples";
import { Icon } from "./Icon";
import styles from "./PadButton.module.css";

interface PadButtonProps {
  pad: Pad;
  /** Lit up by a keyboard hit. Pointer presses use the CSS :active state. */
  isLit: boolean;
  /** The edit sidebar is open for this pad. */
  isEditing: boolean;
  onPlay: () => void;
  onEdit: () => void;
}

export function PadButton({ pad, isLit, isEditing, onPlay, onEdit }: PadButtonProps) {
  const key = pad.shortcutKey.toUpperCase();

  // Fire on pointer down rather than click: a drum hit should sound the
  // moment the pad is touched, not when the finger lifts.
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return; // right/middle buttons: not a hit
    onPlay();
  };

  // Keyboard activation (Enter/Space) arrives as a click with no pointer
  // detail. Pointer clicks were already handled on pointer down.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) onPlay();
  };

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onEdit();
  };

  return (
    <div
      className={cx(styles.pad, isLit && styles.lit)}
      style={{ "--pad": padColorHex(pad.color) } as CSSProperties}
      data-color={pad.color}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label={`${pad.srcName}, shortcut key ${key}`}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span className={styles.label}>
          {shortSampleName(pad.srcName)} / {pad.shortcutKey}
        </span>
      </button>

      <button
        type="button"
        className={styles.editButton}
        aria-label={`Edit pad ${key}: ${pad.srcName}`}
        title="Change sound or color"
        onClick={onEdit}
      >
        <Icon name="edit" />
      </button>

      {isEditing && (
        <div className={styles.editingBadge} aria-hidden="true">
          Editing <Icon name="arrow-right" />
        </div>
      )}
    </div>
  );
}
