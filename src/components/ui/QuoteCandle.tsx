"use client";

import { motion } from "framer-motion";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuoteCandleProps {
    quote: string;
    className?: string;
    delay?: number;
}

export function QuoteCandle({ quote, className, delay = 0 }: QuoteCandleProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 1, type: "spring" }}
            className={cn("absolute cursor-pointer", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative flex flex-col items-center">
                {/* Tooltip Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? -40 : 10,
                        scale: isHovered ? 1 : 0.9
                    }}
                    className="absolute bottom-full mb-2 w-32 md:w-48 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-ember/20 text-center pointer-events-none z-20"
                >
                    <p className="text-xs md:text-sm text-ember-glow font-medium italic leading-relaxed">
                        "{quote}"
                    </p>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-ember/20" />
                </motion.div>

                {/* Candle Flame */}
                <motion.div
                    animate={{
                        filter: isHovered ? "brightness(1.3) drop-shadow(0 0 15px rgba(251,191,36,0.5))" : "brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))"
                    }}
                    className="relative"
                >
                    <CandleFlame size="sm" className={cn("opacity-70 hover:opacity-100 transition-opacity", isHovered && "scale-110")} />

                    {/* Candle Stick Base (Optional, kept minimal) */}
                    <div className="w-2 h-3 bg-stone-800/50 mx-auto -mt-1 rounded-sm blur-[1px]" />
                </motion.div>
            </div>
        </motion.div>
    );
}
