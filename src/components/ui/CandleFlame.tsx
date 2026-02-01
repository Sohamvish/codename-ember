"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CandleFlame({ className, size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-6",
        md: "w-8 h-12",
        lg: "w-16 h-24"
    };

    return (
        <div className={cn("relative flex items-end justify-center", sizeClasses[size], className)}>
            {/* Outer Glow - Optimized */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-0 w-[150%] h-[120%] rounded-full bg-ember-glow blur-md will-change-transform" // Reduced blur, added will-change
            />

            {/* Flame Body */}
            <motion.div
                animate={{
                    scaleY: [1, 1.1, 0.95, 1],
                    rotate: [-2, 2, -1, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="w-full h-full bg-gradient-to-t from-orange-600 via-ember to-yellow-100 rounded-b-full rounded-t-[50%] opacity-90 shadow-[0_0_15px_rgba(251,191,36,0.5)] will-change-transform" // Added will-change
                style={{
                    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    borderTopLeftRadius: "50%",
                    borderTopRightRadius: "50%"
                }}
            />

            {/* Wick */}
            <div className="absolute -bottom-2 w-[10%] h-[20%] bg-stone-800" />
        </div>
    );
}
