import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a CSS media query.
 *
 * Reports `false` while rendering on the server, so markup is the same on both
 * sides of hydration; components that must match the viewport from their very
 * first frame should only be mounted in the browser.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
