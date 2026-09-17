"use client";

import { editModeToggled } from "@/store/editModeSlice";
import { editorClosed } from "@/store/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Icon } from "./Icon";
import styles from "./EditModeToggle.module.css";

/**
 * Turns pad presses into "open the editor" instead of "play".
 *
 * Touch screens have no hover to reveal a per-pad edit button, and a permanent
 * one would sit right where a thumb lands, so this is how a pad is edited
 * there. It works the same with a mouse or a keyboard.
 */
export function EditModeToggle() {
  const editMode = useAppSelector((state) => state.editMode);
  const dispatch = useAppDispatch();

  const toggle = () => {
    // Leaving edit mode with the editor open would strand a panel the user
    // can no longer reopen the same way.
    if (editMode) dispatch(editorClosed());
    dispatch(editModeToggled());
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={editMode}
      title="Press a pad to change its sound or color"
      onClick={toggle}
    >
      <Icon name="edit" />
      <span className={styles.label}>Edit pads</span>
    </button>
  );
}
