"use client";

import { QuoteCandle } from "@/components/ui/QuoteCandle";

export function GlobalCandles() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
            {[
                // Left Side Spread
                { q: "You are stronger than you know.", pos: "top-[12%] left-[5%] md:left-[8%]", d: 1.2, s: "md" },
                { q: "Breathe.", pos: "top-[35%] left-[3%] md:left-[5%]", d: 1.3, s: "sm" },
                { q: "Healing is not linear.", pos: "bottom-[20%] left-[6%] md:left-[10%]", d: 1.7, s: "md" },
                { q: "Keep going.", pos: "top-[60%] left-[8%] md:left-[12%]", d: 2.0, s: "sm" },
                { q: "You are enough.", pos: "bottom-[40%] left-[4%] md:left-[6%]", d: 2.5, s: "sm" },
                { q: "Stay warm.", pos: "top-[80%] left-[5%] md:left-[8%]", d: 2.7, s: "sm" },

                // Right Side Spread
                { q: "Your story matters.", pos: "top-[18%] right-[5%] md:right-[8%]", d: 1.4, s: "md" },
                { q: "You are not alone.", pos: "top-[40%] right-[3%] md:right-[5%]", d: 1.6, s: "sm" },
                { q: "Hope is a discipline.", pos: "bottom-[15%] right-[6%] md:right-[10%]", d: 1.8, s: "md" },
                { q: "One day at a time.", pos: "bottom-[45%] right-[8%] md:right-[12%]", d: 2.2, s: "sm" },
                { q: "Light varies.", pos: "top-[25%] right-[4%] md:right-[6%]", d: 2.3, s: "sm" },
                { q: "Courage.", pos: "bottom-[30%] right-[5%] md:right-[8%]", d: 2.9, s: "sm" },

                // Deep Corners
                { q: "Trust yourself.", pos: "top-[5%] left-[2%]", d: 3.1, s: "sm" },
                { q: "We are here.", pos: "bottom-[5%] right-[2%]", d: 3.3, s: "sm" },

            ].map((c, i) => (
                <QuoteCandle
                    key={i}
                    quote={c.q}
                    className={`pointer-events-auto ${c.pos}`}
                    delay={c.d}
                    size={c.s as "sm" | "md"}
                />
            ))}
        </div>
    );
}
