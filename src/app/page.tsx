"use client";

import { motion } from "framer-motion";
import { CandleFlame } from "@/components/ui/CandleFlame";
import Link from "next/link";



export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center overscroll-none overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,rgba(12,10,9,0)_60%)] pointer-events-none" />

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-12 max-w-md w-full relative">

        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-br from-amber-100 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            Ember
          </h1>
          <p className="text-lg text-stone-400 font-light tracking-wide">
            Where courage burns brighter together.
          </p>
        </motion.div>

        {/* Quote Candles - Moved to GlobalCandles in layout */}

        {/* Interactive Candle Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative group cursor-pointer z-20"
        >
          <Link href="/signup">
            <div className="relative flex flex-col items-center gap-6">

              {/* The Flame itself is the button */}
              <motion.div
                whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative p-8 rounded-full bg-orange-500/5 hover:bg-orange-500/10 transition-colors duration-500"
              >
                <CandleFlame size="lg" className="w-24 h-40 scale-150" />

                {/* Ripple/Pulse effect */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-ember/20"
                />
              </motion.div>

              <motion.span
                className="text-stone-500 text-sm uppercase tracking-[0.3em] font-medium group-hover:text-ember-glow transition-colors duration-300"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Tap to Ignite
              </motion.span>
            </div>
          </Link>
        </motion.div>

      </main>

      {/* Footer/Disclaimer - Moved outside main to stick to bottom of screen */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 text-[10px] text-stone-700 max-w-xs text-center z-10"
      >
        A safe, anonymous space for women to share their stories and find support.
      </motion.p>
    </div>
  );
}
