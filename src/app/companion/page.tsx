"use client";

import { EmberChat } from "@/components/companion/EmberChat";

export default function CompanionPage() {
    return (
        <div className="min-h-screen pt-24 px-4 pb-24 md:pb-8 flex flex-col items-center justify-center relative overscroll-none">
            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.1)_0%,rgba(12,10,9,0)_50%)] pointer-events-none" />

            <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-stone-200 tracking-tight">Ember Companion</h1>
                    <p className="text-stone-400">A quiet space to just be.</p>
                </div>

                <EmberChat />
            </div>
        </div>
    );
}
