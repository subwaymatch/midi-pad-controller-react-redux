/**
 * Path prefix the site is served under.
 *
 * Empty when the app lives at a domain root (Cloudflare, a custom domain on
 * GitHub Pages). Set to "/<repo-name>" for a GitHub Pages project site. The
 * value comes from NEXT_PUBLIC_BASE_PATH at build time; Next.js inlines it
 * into the client bundle, and next.config.ts uses the same value for
 * `basePath` so page routes and public assets stay in sync.
 */
export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function normalizeBasePath(value: string | undefined): string {
  const trimmed = (value ?? "").trim().replace(/\/+$/, "");
  if (trimmed === "") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
