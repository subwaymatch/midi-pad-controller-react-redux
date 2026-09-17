"use client";

import { useRef, type CSSProperties } from "react";
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

/** Used when unmuting if the volume was already at zero when the page opened. */
const FALLBACK_VOLUME = 0.8;

export function VolumeControl() {
  const volume = useAppSelector((state) => state.volume);
  const dispatch = useAppDispatch();
  const percent = Math.round(volume * 100);
  // The icon looks like a mute toggle, so it is one; this is where it goes
  // back to.
  const beforeMute = useRef(volume);

  const toggleMute = () => {
    if (volume > 0) {
      beforeMute.current = volume;
      dispatch(volumeChanged(0));
    } else {
      dispatch(volumeChanged(beforeMute.current || FALLBACK_VOLUME));
    }
  };

  return (
    <div className={styles.volume}>
      <button
        type="button"
        className={styles.mute}
        aria-label="Mute"
        aria-pressed={volume === 0}
        title={volume === 0 ? "Unmute" : "Mute"}
        onClick={toggleMute}
      >
        <Icon name={volumeIcon(volume)} />
      </button>
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
