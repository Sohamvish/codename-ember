"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Phone, ExternalLink, ShieldAlert, HeartHandshake } from "lucide-react";

export default function ResourcesPage() {

    const emergencyContacts = [
        { name: "National Domestic Violence Hotline", number: "1-800-799-SAFE", desc: "24/7 confidential support." },
        { name: "Crisis Text Line", number: "Text HOME to 741741", desc: "Free, 24/7 crisis support." },
        { name: "RAINN (Sexual Assault Hotline)", number: "1-800-656-HOPE", desc: "Confidential sexual assault support." },
    ];

    return (
        <div className="min-h-screen p-4 pt-12 max-w-xl mx-auto space-y-8">

            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-stone-200">Safety & Support</h1>
                <p className="text-stone-400">You are not alone. Help is available.</p>
            </header>

            {/* Quick Exit Tip */}
            <GlassCard className="border-l-4 border-l-red-500 bg-red-900/10">
                <div className="flex gap-4">
                    <ShieldAlert className="text-red-400 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-red-200">Safety Tip</h3>
                        <p className="text-sm text-stone-400 mt-1">If you feel unsafe, click the "Quick Exit" button in the settings (Coming Soon) or close this tab immediately. Clear your browser history if necessary.</p>
                    </div>
                </div>
            </GlassCard>

            {/* Emergency Numbers */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-ember-glow flex items-center gap-2">
                    <Phone size={20} />
                    Immediate Help
                </h2>
                <div className="grid gap-3">
                    {emergencyContacts.map((contact, i) => (
                        <GlassCard key={i} className="flex items-center justify-between p-4 group cursor-pointer hover:bg-stone-800/50">
                            <div>
                                <h3 className="font-medium text-stone-200">{contact.name}</h3>
                                <p className="text-xs text-stone-500">{contact.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 text-ember group-hover:underline">
                                <span className="font-mono text-sm">{contact.number}</span>
                                <ArrowUpRightIcon size={14} />
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* Community Resources */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-teal-400 flex items-center gap-2">
                    <HeartHandshake size={20} />
                    Community & Healing
                </h2>
                <GlassCard className="space-y-4">
                    <p className="text-sm text-stone-300 leading-relaxed">
                        Connect with local women's shelters, therapy groups, and legal aid clinics. We are building a directory of trusted partners.
                    </p>
                    <button className="w-full py-3 rounded-xl bg-teal-500/10 text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition-colors">
                        Find Local Resources
                    </button>
                </GlassCard>
            </section>

            <div className="h-20" />
        </div>
    );
}

function ArrowUpRightIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
    )
}
