import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AmbientEmbers } from "@/components/ui/AmbientEmbers";
import { LiquidBlobs } from "@/components/ui/LiquidBlobs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ember | Light a Candle",
  description: "A safe space for courage and shared stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-midnight text-foreground min-h-screen overflow-x-hidden`}
      >
        <CustomCursor />
        <AmbientEmbers />
        <LiquidBlobs />
        <main className="w-full h-full min-h-screen relative pb-20">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
