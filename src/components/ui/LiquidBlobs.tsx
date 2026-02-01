"use client";

import { motion } from "framer-motion";

export function LiquidBlobs() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Warm Ember Blob */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-30 will-change-transform"
                style={{
                    background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(20px)" // Much cheaper than 80px
                }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Deep Purple/Midnight Blob for contrast */}
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20 will-change-transform"
                style={{
                    background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(30px)" // Reduced from 100px
                }}
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Central "Heart" Glow */}
            <motion.div
                className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full opacity-20 will-change-transform"
                style={{
                    background: "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(20px)" // Reduced from 60px
                }}
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
