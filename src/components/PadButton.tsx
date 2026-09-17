"use client";

import type { CSSProperties, MouseEvent, PointerEvent, Ref } from "react";
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
  /** Pressing the pad opens its editor instead of playing it. */
  editMode: boolean;
  onPlay: () => void;
  onEdit: () => void;
  /** Lets the grid put focus back here once the editor closes. */
  editButtonRef?: Ref<HTMLButtonElement>;
}

export function PadButton({
  pad,
  isLit,
  isEditing,
  editMode,
  onPlay,
  onEdit,
  editButtonRef,
}: PadButtonProps) {
  const key = pad.shortcutKey.toUpperCase();

  // Fire on pointer down rather than click: a drum hit should sound the
  // moment the pad is touched, not when the finger lifts.
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return; // right/middle buttons: not a hit
    if (editMode) return; // in edit mode the press opens the editor instead
    onPlay();
  };

  // Keyboard activation (Enter/Space) arrives as a click with no pointer
  // detail. Pointer clicks were already handled on pointer down. In edit mode
  // the editor opens from here, so a press that slides off the pad cancels.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (editMode) onEdit();
    else if (event.detail === 0) onPlay();
  };

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onEdit();
  };

  return (
    <div
      className={cx(styles.pad, isLit && styles.lit, editMode && styles.editable)}
      style={
        {
          "--pad": padColorHex(pad.color),
        } as CSSProperties
      }
      data-color={pad.color}
    >
      <button
        type="button"
        className={styles.trigger}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span className={styles.label}>
          {shortSampleName(pad.srcName)}
          <span className={styles.keyHint}> / {key}</span>
        </span>
        {/* Building the accessible name out of the content, rather than an
            aria-label, keeps it a superset of the visible label (WCAG 2.5.3)
            even on touch, where the key suffix is hidden. */}
        <span className="visually-hidden">
          {pad.srcName}
          {editMode ? ", edit this pad" : `, shortcut key ${key}`}
        </span>
      </button>

      <button
        type="button"
        ref={editButtonRef}
        className={styles.editButton}
        aria-label={`Edit pad ${key}: ${pad.srcName}`}
        title="Change sound or color"
        onClick={onEdit}
      >
        <Icon name="edit" />
      </button>

      {editMode && !isEditing && (
        <div className={styles.editHint} aria-hidden="true">
          <Icon name="edit" />
        </div>
      )}

      {isEditing && (
        <div className={styles.editingBadge} aria-hidden="true">
          Editing <Icon name="arrow-right" />
        </div>
      )}
    </div>
  );
}
