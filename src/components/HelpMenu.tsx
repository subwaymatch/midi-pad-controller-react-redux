"use client";

import { useEffect, useId, useRef, useState } from "react";
import { editorClosed } from "@/store/editorSlice";
import { useAppDispatch } from "@/store/hooks";
import { padsReset } from "@/store/padsSlice";
import { Icon } from "./Icon";
import styles from "./HelpMenu.module.css";

export function HelpMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) return;

    // Dismissing on pointer down rather than click is deliberate: a pad under
    // the panel still sounds when it is pressed. An instrument that swallowed
    // the hit which closed a menu would feel broken.
    const closeIfOutside = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeIfOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeIfOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const handleReset = () => {
    dispatch(padsReset());
    dispatch(editorClosed());
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.help}>
      <button
        type="button"
        className={styles.toggle}
        aria-label="Help"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="help" />
      </button>

      {/* Closing the panel unmounts it, which is what takes a half-finished
          reset confirmation back to its starting point. */}
      {open && <HelpPanel id={panelId} onReset={handleReset} />}
    </div>
  );
}

function HelpPanel({ id, onReset }: { id: string; onReset: () => void }) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div id={id} className={styles.panel} role="region" aria-label="Help">
      <section>
        <h2>Changing a pad&apos;s sound or color</h2>
        {/* The same thing said two ways: a touch screen has neither an edit
            button revealed by hover nor a right-click. */}
        <p className={styles.pointerOnly}>
          Right-click a pad, or press its edit button, to pick another sample or
          color.
        </p>
        <p className={styles.touchOnly}>
          Turn on <strong>Edit pads</strong> in the top bar, then tap a pad to pick
          another sample or color.
        </p>

        {confirmingReset ? (
          // An inline step rather than window.confirm(): some in-app browsers
          // suppress that dialog, and a suppressed confirm returns false, which
          // would make resetting impossible there.
          <div className={styles.confirm}>
            <p>Reset every pad to its default sound and color?</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.danger} onClick={onReset}>
                Reset everything
              </button>
              <button
                type="button"
                className={styles.action}
                onClick={() => setConfirmingReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.action}
            onClick={() => setConfirmingReset(true)}
          >
            <Icon name="refresh" />
            Reset to defaults
          </button>
        )}
      </section>

      <section className={styles.pointerOnly}>
        <h2>Playing with a keyboard</h2>
        <p>The letter on each pad is its keyboard shortcut.</p>
      </section>

      <a
        className={styles.action}
        href="https://99sounds.org/drum-samples/"
        target="_blank"
        rel="noreferrer"
      >
        <Icon name="heart" />
        <span>
          Audio files from <strong>99Sounds Drum Samples</strong>
        </span>
      </a>
    </div>
  );
}
