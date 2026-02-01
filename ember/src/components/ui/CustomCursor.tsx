"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the cursor follower
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Only show custom cursor on desktop to avoid issues on touch devices
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Global CSS to hide default cursor */}
            <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none !important;
        }
      `}</style>

            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-ember-glow rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: mouseX, // Zero latency for the main dot
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Trailing Glow / Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-ember rounded-full pointer-events-none z-[9998] opacity-50"
                style={{
                    x: cursorX, // Smooth follow for the ring
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />
        </>
    );
}
