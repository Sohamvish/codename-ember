"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div className="relative mb-8 opacity-50 grayscale">
                {/* A simplified 'extinguished' candle representation */}
                <div className="w-8 h-12 bg-stone-800 rounded-b-lg mx-auto relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-stone-600" /> {/* Wick */}
                    {/* No flame, just a wisp of smoke */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-stone-500/20 to-transparent blur-sm skew-x-12" />
                </div>
            </div>

            <GlassCard className="max-w-sm w-full space-y-4 border-stone-800 bg-stone-900/40">
                <h1 className="text-2xl font-bold text-stone-400">The light ends here.</h1>
                <p className="text-stone-500 text-sm leading-relaxed">
                    You've wandered into the darkness. There is nothing to see here.
                </p>

                <div className="pt-2">
                    <Link href="/hearth">
                        <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft size={16} />
                            <span>Return to the Hearth</span>
                        </button>
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
