"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { ArrowUp, Mic, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/Toast";

export default function SharePage() {
    const [content, setContent] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const supabase = createClient();
    const router = useRouter();
    const { showToast } = useToast();
    const tags = ["Courage", "Healing", "Hope", "Support", "Venting", "Advice"];

    const handlePost = async () => {
        if (!content || !selectedTag) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('stories').insert({
                content,
                tag: [selectedTag],
                is_anonymous: isAnonymous,
                user_id: user?.id || null
            });

            if (error) throw error;

            // Reset and redirect
            showToast("Your candle has been lit. 🔥", "success");
            router.push('/hearth');
        } catch (e: any) {
            console.error(e);
            showToast("Failed to share light: " + e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 pt-12 max-w-xl mx-auto flex flex-col items-center">

            <div className="w-full mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-stone-200">Share your light</h1>
                <CandleFlame size="sm" />
            </div>

            <GlassCard className="w-full flex-1 flex flex-col mb-20 bg-stone-900/40">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? This space is safe..."
                    className="w-full flex-1 bg-transparent resize-none outline-none text-lg text-stone-200 placeholder:text-stone-600 leading-relaxed font-light p-2"
                />

                <div className="mt-6 space-y-4">
                    {/* Anonymity Toggle */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-stone-300">Post Anonymously</span>
                            <span className="text-xs text-stone-500">Hide your username from this post</span>
                        </div>
                        <button
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                isAnonymous ? "bg-ember" : "bg-stone-700"
                            )}
                        >
                            <motion.div
                                animate={{ x: isAnonymous ? 26 : 2 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>

                    <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                        Select a Tag
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm border transition-all",
                                    selectedTag === tag
                                        ? "bg-ember text-black border-ember shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                        : "bg-white/5 border-white/10 text-stone-400 hover:border-ember/30 hover:text-stone-200"
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end">
                    <button
                        onClick={handlePost}
                        disabled={!content || !selectedTag || loading}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-ember to-orange-600 text-black font-semibold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                    >
                        <span>{loading ? "Kindling..." : "Light Candle"}</span>
                        <ArrowUp size={18} />
                    </button>
                </div>
            </GlassCard>

        </div>
    );
}
