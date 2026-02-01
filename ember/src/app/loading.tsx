"use client";

import { CandleFlame } from "@/components/ui/CandleFlame";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-midnight/80 backdrop-blur-sm">
            <CandleFlame size="lg" />
            <p className="mt-4 text-stone-500 text-sm font-medium animate-pulse">
                Kindling...
            </p>
        </div>
    );
}
