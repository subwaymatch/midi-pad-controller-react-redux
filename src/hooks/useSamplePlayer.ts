import { useEffect, useState } from "react";
import { SamplePlayer } from "@/lib/audio/SamplePlayer";

/** One SamplePlayer for the lifetime of the component, kept at `volume`. */
export function useSamplePlayer(volume: number): SamplePlayer {
  const [player] = useState(() => new SamplePlayer(volume));

  useEffect(() => {
    player.setVolume(volume);
  }, [player, volume]);

  useEffect(() => {
    return () => {
      void player.dispose();
    };
  }, [player]);

  return player;
}
