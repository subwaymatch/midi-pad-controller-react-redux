import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import type { ReactNode } from "react";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "MIDI Pad Controller",
  description:
    "A browser drum pad with 99 samples. Hit the pads with a mouse, a finger or the keyboard, and give each pad its own sound and color.",
  applicationName: "MIDI Pad Controller",
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
