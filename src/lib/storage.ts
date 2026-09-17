import { DEFAULT_PADS } from "@/data/defaultPads";
import { isPadColor } from "./colors";
import type { Pad } from "./pads";
import { isSampleName } from "./samples";

/** Keys are unchanged from the original app so saved layouts carry over. */
export const STORAGE_KEYS = {
  volume: "volume",
  pads: "padMappings",
} as const;

export const DEFAULT_VOLUME = 0.8;

export interface PersistedState {
  volume: number;
  pads: Pad[];
}

export function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Accepts any stored value and returns a usable volume. */
export function sanitizeVolume(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? clampVolume(value)
    : DEFAULT_VOLUME;
}

/**
 * Accepts any stored value and returns a full, valid pad layout. Each pad is
 * checked on its own, so one corrupt entry falls back to its default without
 * discarding the rest. Shortcut keys are not user-editable and always come
 * from the defaults.
 */
export function sanitizePads(value: unknown): Pad[] {
  const stored: unknown[] = Array.isArray(value) ? value : [];

  return DEFAULT_PADS.map((fallback, index) => {
    const item = stored[index];
    if (!isRecord(item)) return { ...fallback };

    return {
      srcName: isSampleName(item.srcName) ? item.srcName : fallback.srcName,
      shortcutKey: fallback.shortcutKey,
      color: isPadColor(item.color) ? item.color : fallback.color,
    };
  });
}

export function loadPersistedState(): PersistedState {
  return {
    volume: sanitizeVolume(readJson(STORAGE_KEYS.volume)),
    pads: sanitizePads(readJson(STORAGE_KEYS.pads)),
  };
}

export function saveVolume(volume: number): void {
  writeJson(STORAGE_KEYS.volume, volume);
}

export function savePads(pads: readonly Pad[]): void {
  writeJson(STORAGE_KEYS.pads, pads);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Access can throw when storage is disabled (e.g. some private modes).
    return null;
  }
}

function readJson(key: string): unknown {
  const storage = getStorage();
  if (!storage) return undefined;
  try {
    const raw = storage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    getStorage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage disabled: the app keeps working, settings
    // just will not survive a reload.
  }
}
