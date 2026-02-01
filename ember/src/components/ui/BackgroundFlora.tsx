"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundFlora() {
    const [isMounted, setIsMounted] = useState(false);

    // Mouse tracking for flashlight effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the movement
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Mask logic (Moved up to avoid conditional hook call)
    const maskImage = useMotionTemplate`radial-gradient(350px circle at ${springX}px ${springY}px, black 0%, transparent 100%)`;

    useEffect(() => {
        setIsMounted(true);
        if (typeof window === "undefined") return;

        // Center initially
        mouseX.set(window.innerWidth / 2);
        mouseY.set(window.innerHeight / 2);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (!isMounted) return null;

    return (
        <motion.div
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
            style={{
                // The Mask: Radial gradient that reveals content at cursor position
                maskImage,
                WebkitMaskImage: maskImage
            }}
        >
            {/* Background Container - darker to let flashlight pop */}

            {/* Large Fern - Bottom Left */}
            <Flora
                d="M10,100 Q30,50 60,90 T100,20"
                className="text-stone-700/80 w-[600px] h-[600px] -bottom-20 -left-20"
                delay={0}
            />

            {/* Vine - Top Right */}
            <Flora
                d="M50,0 Q60,40 20,80 T40,150"
                className="text-amber-900/40 w-[400px] h-[600px] -top-20 -right-20 rotate-180"
                delay={2}
                duration={15}
            />

            {/* Ember Leaf - Bottom Right */}
            <Flora
                d="M0,100 C20,100 40,80 50,50 C60,20 40,0 20,0 C0,0 -20,20 -10,50 C0,80 20,100 0,100"
                className="text-amber-500/30 w-[500px] h-[500px] -bottom-40 -right-20"
                delay={1}
                duration={20}
            />

            {/* Shadow Fern - Left mid */}
            <Flora
                d="M10,100 Q40,60 80,80 T150,10"
                className="text-stone-800/80 w-[400px] h-[400px] top-1/3 -left-40"
                delay={4}
                duration={25}
            />

            {/* Extra Flora Center - to ensure effect is visible in middle */}
            <Flora
                d="M50,0 Q20,50 80,100 T50,200"
                className="text-stone-800/60 w-[300px] h-[500px] top-20 left-1/3"
                delay={6}
                duration={30}
            />
        </motion.div>
    );
}

// Helper for template literals with motion values
import { useMotionTemplate } from "framer-motion";

function Flora({ d, className, delay = 0, duration = 10 }: { d: string, className?: string, delay?: number, duration?: number }) {
    return (
        <motion.div
            className={`absolute ${className}`}
            initial={{ rotate: 0 }}
            animate={{
                rotate: [0, 5, 0, -3, 0],
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        >
            <svg viewBox="0 0 200 200" className="w-full h-full fill-current">
                {/* REMOVED BLURS for performance */}
                <path d={d} stroke="currentColor" strokeWidth="20" strokeLinecap="round" fill="none" />
                <path d={d} stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" className="opacity-50" />
            </svg>
        </motion.div>
    );
}
