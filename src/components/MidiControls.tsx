"use client";

import { EditModeToggle } from "./EditModeToggle";
import { HelpMenu } from "./HelpMenu";
import styles from "./MidiControls.module.css";
import { VolumeControl } from "./VolumeControl";

export function MidiControls() {
  return (
    <div className={styles.bar}>
      <VolumeControl />
      <div className={styles.spacer} />
      <EditModeToggle />
      <HelpMenu />
    </div>
  );
}
