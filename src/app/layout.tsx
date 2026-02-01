import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AmbientEmbers } from "@/components/ui/AmbientEmbers";
import { LiquidBlobs } from "@/components/ui/LiquidBlobs";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ember | Share Your Light",
  description: "A safe space to share stories of courage.",
};

import { GlobalCandles } from "@/components/ui/GlobalCandles";
import { JournalOverlay } from "@/components/journal/JournalOverlay";
import { ChatProvider } from "@/context/ChatContext";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { ChatOverlay } from "@/components/chat/ChatOverlay";
import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-stone-950 text-stone-200 antialiased overflow-x-hidden selection:bg-ember/30 selection:text-ember-light")}>
        <ToastProvider>
          <ChatProvider>
            <JournalOverlay />
            <ChatOverlay />
            <ChatDrawer />

            <AmbientEmbers />
            <GlobalCandles />
            <LiquidBlobs />

            <div className="relative z-10 min-h-screen">
              {children}
            </div>

            <CustomCursor />
            <MobileNav />
          </ChatProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
