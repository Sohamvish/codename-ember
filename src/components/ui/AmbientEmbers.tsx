"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AmbientEmbers() {
    const [embers, setEmbers] = useState<{ id: number; left: string }[]>([]);

    useEffect(() => {
        // Determine number of embers based on screen size roughly
        const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 15 : 30;
        const newEmbers = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
        }));
        setEmbers(newEmbers);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {embers.map((ember) => (
                <Ember key={ember.id} left={ember.left} />
            ))}
        </div>
    );
}

function Ember({ left }: { left: string }) {
    // Randomize animation properties for organic feel
    const duration = 15 + Math.random() * 20; // 15-35s
    const delay = Math.random() * 20; // 0-20s delay start
    const size = 2 + Math.random() * 4; // 2-6px

    return (
        <motion.div
            className="absolute bottom-[-10px] rounded-full blur-[1px]"
            style={{
                left,
                width: size,
                height: size,
                background: "radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(245,158,11,0) 70%)",
                boxShadow: "0 0 10px rgba(251,191,36, 0.4)"
            }}
            animate={{
                y: [0, -window.innerHeight - 100],
                x: [0, Math.random() * 100 - 50], // Drift left/right
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0.5]
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay: -delay, // Start immediately at random point in cycle
            }}
        />
    );
}
