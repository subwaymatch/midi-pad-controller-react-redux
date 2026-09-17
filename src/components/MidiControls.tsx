"use client";

import { HelpMenu } from "./HelpMenu";
import styles from "./MidiControls.module.css";
import { VolumeControl } from "./VolumeControl";

export function MidiControls() {
  return (
    <div className={styles.bar}>
      <VolumeControl />
      <HelpMenu />
    </div>
  );
}
