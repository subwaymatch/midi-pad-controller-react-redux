import samples from "@/data/samples.json";
import { BASE_PATH } from "./basePath";

/** Sample display name -> file name under `public/sounds/`. */
export const SAMPLE_FILES: Readonly<Record<string, string>> = samples;

/** All sample names, in the order they are listed in the editor. */
export const SAMPLE_NAMES: readonly string[] = Object.keys(samples);

export function isSampleName(value: unknown): value is string {
  return typeof value === "string" && Object.hasOwn(SAMPLE_FILES, value);
}

/** Absolute URL path of a sample, honoring the site's base path. */
export function sampleUrl(name: string): string {
  const file = SAMPLE_FILES[name];
  if (!file) throw new Error(`Unknown sample: ${name}`);
  return `${BASE_PATH}/sounds/${file}`;
}

/** "Hihat Acoustic01" -> "Hihat": the short label shown on a pad. */
export function shortSampleName(name: string): string {
  const [first] = name.trim().split(/\s+/);
  return first || name;
}
