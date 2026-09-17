import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { BASE_PATH } from "@/lib/basePath";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

// Vendored rather than pulled from `next/font/google` so the build never needs
// to reach fonts.googleapis.com: CI behind a proxy, and offline development,
// both work. One variable file covers the 400 and 500 weights the app uses.
const roboto = localFont({
  src: "./fonts/roboto-latin-variable.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-roboto",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "MIDI Pad Controller",
  description:
    "A browser drum pad with 99 samples. Hit the pads with a mouse, a finger or the keyboard, and give each pad its own sound and color.",
  applicationName: "MIDI Pad Controller",
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.ico`, sizes: "64x64 32x32 24x24 16x16" },
      { url: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: { url: `${BASE_PATH}/apple-touch-icon.png`, sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
