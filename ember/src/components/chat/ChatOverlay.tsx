"use client";

import { MessageSquare } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ChatOverlay() {
    const { openChat, isOpen } = useChat();
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

            // Listen for auth changes (sign in / sign out)
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

    if (isOpen || !visible) return null;

    return (
        <button
            onClick={() => openChat()}
            className="fixed bottom-6 right-6 z-[60] p-3 bg-ember/90 backdrop-blur-md border border-amber-500/20 rounded-full text-stone-900 hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all group flex items-center justify-center"
            title="Open Messages"
        >
            <MessageSquare size={24} className="group-hover:rotate-6 transition-transform" />
        </button>
    );
}
