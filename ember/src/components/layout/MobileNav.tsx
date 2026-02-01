"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Flame, PenLine, HeartHandshake, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MobileNav() {
    const pathname = usePathname();

    // Hide nav on landing page and signup page
    if (pathname === "/" || pathname === "/signup") return null;

    const navItems = [
        { href: "/hearth", label: "Hearth", icon: Flame },
        { href: "/companion", label: "Ember", icon: Sparkles },
        { href: "/share", label: "Share", icon: PenLine },
        { href: "/resources", label: "Help", icon: HeartHandshake },
        { href: "/profile", label: "Me", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 safely-padded-bottom pointer-events-none">
            <nav className="glass-panel mx-auto max-w-sm rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-black/40 pointer-events-auto backdrop-blur-xl bg-black/40 border border-white/10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors",
                                isActive ? "text-ember-glow" : "text-stone-400 hover:text-stone-200"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-ember/10 rounded-full blur-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-1 w-1 h-1 bg-ember-glow rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
