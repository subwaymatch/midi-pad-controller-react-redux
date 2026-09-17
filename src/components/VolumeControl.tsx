"use client";

import type { CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { volumeChanged } from "@/store/volumeSlice";
import { Icon, type IconName } from "./Icon";
import styles from "./VolumeControl.module.css";

function volumeIcon(volume: number): IconName {
  if (volume === 0) return "volume-off";
  if (volume < 0.3) return "volume-mute";
  if (volume < 0.6) return "volume-low";
  return "volume-high";
}

export function VolumeControl() {
  const volume = useAppSelector((state) => state.volume);
  const dispatch = useAppDispatch();
  const percent = Math.round(volume * 100);

  return (
    <div className={styles.volume}>
      <Icon name={volumeIcon(volume)} className={styles.icon} />
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={100}
        step={1}
        value={percent}
        onChange={(event) => dispatch(volumeChanged(Number(event.target.value) / 100))}
        aria-label="Volume"
        aria-valuetext={`${percent}%`}
        style={{ "--fill": `${percent}%` } as CSSProperties}
      />
    </div>
  );
}
