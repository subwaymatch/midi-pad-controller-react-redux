"use client";

import { useId, type CSSProperties } from "react";
import { PAD_COLORS, type PadColor } from "@/lib/colors";
import styles from "./ColorSwatches.module.css";

interface ColorSwatchesProps {
  value: PadColor;
  onChange: (color: PadColor) => void;
}

/** A radio group rendered as a row of color dots. */
export function ColorSwatches({ value, onChange }: ColorSwatchesProps) {
  const groupName = useId();

  return (
    <fieldset className={styles.swatches}>
      <legend className="visually-hidden">Button color</legend>
      {PAD_COLORS.map((color) => (
        <label
          key={color.id}
          className={styles.swatch}
          title={color.label}
          style={{ "--swatch": color.hex } as CSSProperties}
        >
          <input
            type="radio"
            className={styles.input}
            name={groupName}
            value={color.id}
            checked={color.id === value}
            onChange={() => onChange(color.id)}
          />
          <span className={styles.dot} aria-hidden="true" />
          <span className="visually-hidden">{color.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
