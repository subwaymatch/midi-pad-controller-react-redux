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
    if (window.confirm("Reset every pad to its default sound and color?")) {
      dispatch(padsReset());
      dispatch(editorClosed());
      setOpen(false);
    }
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

      {open && (
        <div id={panelId} className={styles.panel} role="region" aria-label="Help">
          <section>
            <h2>Changing a pad&apos;s sound or color</h2>
            <p>Right-click a pad, or press its edit button, to pick another sample or color.</p>
            <button type="button" className={styles.action} onClick={handleReset}>
              <Icon name="refresh" />
              Reset to defaults
            </button>
          </section>

          <section>
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
      )}
    </div>
  );
}
