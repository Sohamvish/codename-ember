"use client";

import { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { JournalDrawer } from "./JournalDrawer";

export function JournalOverlay() {
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await import("@/lib/supabase").then(m => m.createClient().auth.getUser());
            if (data.user) setVisible(true);
        };
        checkAuth();
    }, []);

    if (!visible) return null; // Hide if not logged in

    return (
        <>
            {/* Top Right Trigger Button */}
            <button
                onClick={() => setIsJournalOpen(true)}
                className="fixed top-6 right-6 z-[60] p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-stone-400 hover:text-ember hover:bg-black/40 transition-all hover:scale-105 shadow-lg group hidden md:flex"
                title="Open Journal"
            >
                <Book size={20} className="group-hover:stroke-ember" />
            </button>

            <JournalDrawer
                isOpen={isJournalOpen}
                onClose={() => setIsJournalOpen(false)}
            />
        </>
    );
}
