"use client";

import { motion } from "framer-motion";
import { CandleFlame } from "@/components/ui/CandleFlame";
import Link from "next/link";

import { QuoteCandle } from "@/components/ui/QuoteCandle";

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

        {/* Quote Candles - Surrounding the main button */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left */}
          <QuoteCandle quote="You are stronger than you know." className="pointer-events-auto top-0 -left-12 md:-left-32" delay={1.2} />
          {/* Top Right */}
          <QuoteCandle quote="Your story matters." className="pointer-events-auto top-10 -right-8 md:-right-24" delay={1.4} />
          {/* Bottom Left */}
          <QuoteCandle quote="Healing is not linear." className="pointer-events-auto bottom-20 -left-6 md:-left-20" delay={1.6} />
          {/* Bottom Right */}
          <QuoteCandle quote="There is hope in the dark." className="pointer-events-auto bottom-0 -right-10 md:-right-28" delay={1.8} />
        </div>

        {/* Interactive Candle Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative group cursor-pointer"
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

        {/* Footer/Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 text-xs text-stone-700 max-w-xs"
        >
          A safe, anonymous space for women to share their stories and find support.
        </motion.p>

      </main>
    </div>
  );
}
