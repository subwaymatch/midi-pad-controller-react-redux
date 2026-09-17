import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/basePath";

const nextConfig: NextConfig = {
  // The app runs entirely in the browser, so it ships as plain static files
  // that any host can serve: Cloudflare Workers/Pages, GitHub Pages, ...
  output: "export",
  // Set NEXT_PUBLIC_BASE_PATH when the site lives under a sub-path, e.g.
  // "/my-repo" for a GitHub Pages project site. Empty for a domain root.
  basePath: BASE_PATH || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
