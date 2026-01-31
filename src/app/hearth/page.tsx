"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { Heart, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import { motion } from "framer-motion";
import { CommentSection } from "@/components/ui/CommentSection";

type Story = Database['public']['Tables']['stories']['Row'];

export default function HearthPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStories = async () => {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setStories(data);
            setLoading(false);
        };

        fetchStories();

        // Realtime subscription (Optional - bonus polish)
        const channel = supabase
            .channel('realtime stories')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stories' }, (payload) => {
                setStories((current) => [payload.new as Story, ...current]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); }
    }, []);

    return (
        <div className="min-h-screen p-4 pt-12 md:pt-16 max-w-xl mx-auto space-y-6">

            <header className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-ember to-orange-500 bg-clip-text text-transparent">The Hearth</h1>
                    <p className="text-stone-400 text-sm">Validating stories from around the world.</p>
                </div>
                <CandleFlame size="sm" />
            </header>

            <div className="space-y-4">
                {loading && <p className="text-center text-stone-500 animate-pulse">Listening for whispers...</p>}

                {!loading && stories.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p>The hearth is quiet.</p>
                        <p className="text-sm">Be the first to light a candle.</p>
                    </div>
                )}

                {stories.map((story) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={story.id}
                    >
                        <GlassCard className="relative overflow-hidden group">
                            {/* Tag */}
                            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-ember/10 border border-ember/20 text-[10px] text-ember uppercase tracking-wider font-semibold">
                                {story.tag}
                            </div>

                            {/* Content */}
                            <div className="pr-4 mb-4">
                                <p className="text-stone-200 leading-relaxed font-light">{story.content}</p>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col mt-4 border-t border-white/5 pt-3">
                                <div className="flex items-center justify-between text-stone-500 text-sm">
                                    <span className="text-xs">
                                        {new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>

                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 hover:text-ember transition-colors">
                                            <Heart size={16} />
                                            <span className="text-xs">{story.likes_count || 0}</span>
                                        </button>
                                        <button className="hover:text-stone-300">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                                <CommentSection storyId={story.id} />
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="h-20" /> {/* Spacer for Nav */}
        </div>
    );
}
