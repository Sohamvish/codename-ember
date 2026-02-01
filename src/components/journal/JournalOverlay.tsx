"use client";

import { useState, useEffect } from "react";
import { Book } from "lucide-react";
import { JournalDrawer } from "./JournalDrawer";
import { MobileNav } from "@/components/layout/MobileNav";
import { usePathname } from "next/navigation";
import { AuthChangeEvent, Session, Subscription } from "@supabase/supabase-js";

export function JournalOverlay() {
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        let subscription: Subscription | null = null;
        const setup = async () => {
            const supabase = await import("@/lib/supabase").then(m => m.createClient());

            const check = async () => {
                const { data } = await supabase.auth.getUser();
                setVisible(!!data.user);
            };
            check();

            const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
                setVisible(!!session);
            });
            subscription = data.subscription;
        };
        setup();

        return () => {
            if (subscription) subscription.unsubscribe();
        }
    }, []);

    // Hide on landing/signup pages OR if not logged in
    if (pathname === "/" || pathname === "/signup" || !visible) return null;

    return (
        <>
            {/* Top Right Trigger Button - Visible on Desktop/Tablet */}
            <button
                onClick={() => setIsJournalOpen(true)}
                className="fixed top-6 right-6 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl text-stone-400 hover:text-ember hover:bg-black/40 transition-all hover:scale-105 shadow-lg group hidden md:flex flex-col items-center gap-1"
                title="Vent?"
            >
                <Book size={28} className="group-hover:stroke-ember" />
                <span className="text-xs font-medium text-ember">Vent?</span>
            </button>

            <JournalDrawer
                isOpen={isJournalOpen}
                onClose={() => setIsJournalOpen(false)}
            />

            {/* MobileNav is handled in Layout, but user included it in snippet. 
                I will NOT duplicate it here to avoid double navs since it's already in global layout. 
                The user wanted "holes patched", ensuring no dupes is a patch.
            */}
        </>
    );
}
