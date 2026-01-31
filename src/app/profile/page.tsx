"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { Settings, Shield, Moon, LogOut } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="min-h-screen p-4 pt-12 max-w-xl mx-auto space-y-8">

            <header className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-800 to-black border border-stone-700 flex items-center justify-center overflow-hidden">
                        <CandleFlame size="sm" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-midnight" title="Online / Safe" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-200">Anonymous Keeper</h1>
                    <p className="text-stone-500 text-sm">Member since Jan 2026</p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Candles Lit", val: "12" },
                    { label: "Lives Touched", val: "89" },
                    { label: "Streaks", val: "5 days" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-4 flex flex-col items-center justify-center gap-1">
                        <span className="text-xl font-bold text-ember-glow">{stat.val}</span>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500">{stat.label}</span>
                    </GlassCard>
                ))}
            </div>

            {/* Settings */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest ml-1">Settings</h2>

                <GlassCard className="p-0 overflow-hidden">
                    <SettingItem icon={Shield} label="Privacy & Anonymity" onClick={() => alert("Privacy Settings: Coming Soon")} />
                    <div className="h-px bg-white/5" />
                    <SettingItem icon={Moon} label="Appearance" onClick={() => alert("Dark Mode is enabled by default.")} />
                    <div className="h-px bg-white/5" />
                    <SettingItem icon={Settings} label="Account Settings" onClick={() => alert("Account Management: Coming Soon")} />
                </GlassCard>

                <button
                    onClick={() => { alert("Signing out..."); window.location.href = "/"; }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-900/30 text-red-400 hover:bg-red-950/20 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Sign Out & Clear Data</span>
                </button>
            </div>

            <div className="h-20" />
        </div>
    );
}

function SettingItem({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
        >
            <div className="flex items-center gap-3 text-stone-300">
                <Icon size={18} />
                <span>{label}</span>
            </div>
            <div className="text-stone-600">
                {/* Chevron Right */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
        </button>
    )
}
