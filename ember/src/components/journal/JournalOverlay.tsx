"use client";

import { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { JournalDrawer } from "./JournalDrawer";
import { usePathname } from "next/navigation";

export function JournalOverlay() {
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let subscription: any;
        const setup = async () => {
            const supabase = await import("@/lib/supabase").then(m => m.createClient());

            const check = async () => {
                const { data } = await supabase.auth.getUser();
                setVisible(!!data.user);
            };
            check();

            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                setVisible(!!session);
            });
            subscription = data.subscription;
        };
        setup();

        return () => {
            if (subscription) subscription.unsubscribe();
        }
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
