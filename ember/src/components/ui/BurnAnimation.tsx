"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BurnAnimationProps {
    onComplete: () => void;
}

export function BurnAnimation({ onComplete }: BurnAnimationProps) {
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        setParticles(Array.from({ length: 40 }, (_, i) => i)); // 40 particles
        const timer = setTimeout(onComplete, 2200); // 2.2 seconds total (Faster reset)
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">

            {/* 1. Base Heat Glow (Entire Bottom) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.5 }}
                className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-600/50 to-transparent blur-2xl mix-blend-screen"
            />

            {/* 2. Left Corner Fire (Intense) */}
            <motion.div
                initial={{ opacity: 0, scale: 0, x: -20, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 2, 2.5], x: 20, y: -60 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-600 via-red-500 to-transparent blur-lg rounded-full mix-blend-screen"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5], y: -40 }}
                transition={{ duration: 1.5, delay: 0.1 }}
                className="absolute bottom-0 left-4 w-20 h-20 bg-yellow-400 blur-md rounded-full mix-blend-plus-lighter"
            />

            {/* 3. Right Corner Fire (Intense) */}
            <motion.div
                initial={{ opacity: 0, scale: 0, x: 20, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 2, 2.5], x: -20, y: -60 }}
                transition={{ duration: 2, delay: 0.1, ease: "easeOut" }}
                className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-red-600 via-orange-500 to-transparent blur-lg rounded-full mix-blend-screen"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5], y: -40 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="absolute bottom-0 right-4 w-20 h-20 bg-yellow-400 blur-md rounded-full mix-blend-plus-lighter"
            />

            {/* 4. Spreading Center Fire (Delayed) */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: [0, 1, 0], height: 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute bottom-0 left-1/4 right-1/4 bg-gradient-to-t from-orange-500 via-red-500 to-transparent blur-md mix-blend-screen"
            />

            {/* 5. Flying Sparks/Embers */}
            {particles.map((i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        y: "100%",
                        x: i % 2 === 0 ? "5%" : "95%", // Start from corners
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        y: "-100%",
                        x: i % 2 === 0 ? "40%" : "60%", // Converge towards center slightly
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: 1.5 + Math.random() * 2,
                        delay: Math.random() * 1.5,
                        ease: "easeOut"
                    }}
                    className={`absolute rounded-full z-40 ${i % 3 === 0 ? "bg-white w-1 h-1 shadow-[0_0_5px_white]" :
                        i % 3 === 1 ? "bg-yellow-300 w-1.5 h-1.5" : "bg-orange-500 w-2 h-2"
                        }`}
                />
            ))}
        </div>
    );
}
