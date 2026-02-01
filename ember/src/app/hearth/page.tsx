"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { Heart, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import { motion } from "framer-motion";
import { CommentSection } from "@/components/ui/CommentSection";
import { useChat } from "@/context/ChatContext";
import { MessageCircle } from "lucide-react";

type Story = Database['public']['Tables']['stories']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function HearthPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<Record<string, Profile>>({});
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const supabase = createClient();
    const { openChat } = useChat();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUser(user.id);
        };
        fetchUser();

        const fetchStoriesAndProfiles = async () => {
            const { data: storiesData } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false });

            if (storiesData) {
                setStories(storiesData);

                // Fetch profiles for non-anonymous stories
                const userIds = Array.from(new Set(storiesData.filter(s => !s.is_anonymous && s.user_id).map(s => s.user_id)));

                if (userIds.length > 0) {
                    const { data: profilesData } = await supabase
                        .from('profiles')
                        .select('*')
                        .in('id', userIds);

                    if (profilesData) {
                        const profileMap = profilesData.reduce((acc, profile) => ({ ...acc, [profile.id]: profile }), {});
                        setProfiles(profileMap);
                    }
                }
            }
            setLoading(false);
        };

        fetchStoriesAndProfiles();

        // ... (Realtime subscription kept simple or removed for brevity, keeps existing if needed)
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

                {stories.map((story) => {
                    const author = (!story.is_anonymous && story.user_id && profiles[story.user_id])
                        ? profiles[story.user_id].username
                        : "Anonymous";

                    return (
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

                                {/* Author Header */}
                                <div className="mb-2 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${author === "Anonymous" ? "bg-stone-600" : "bg-green-500"}`} />
                                    <span className={`text-xs font-medium ${author === "Anonymous" ? "text-stone-500" : "text-stone-300"}`}>
                                        {author}
                                    </span>
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
                                            <LikeButton
                                                count={story.likes_count || 0}
                                                onClick={async () => {
                                                    // Optimistic update
                                                    const newStories = stories.map(s =>
                                                        s.id === story.id ? { ...s, likes_count: (s.likes_count || 0) + 1 } : s
                                                    );
                                                    setStories(newStories);

                                                    await supabase.rpc('increment_story_likes', { row_id: story.id });
                                                    // Fallback mechanism
                                                    const { error } = await supabase
                                                        .from('stories')
                                                        .update({ likes_count: (story.likes_count || 0) + 1 })
                                                        .eq('id', story.id);

                                                    if (error) console.error("Error liking story:", error);
                                                }}
                                            />

                                            {/* Message Button */}
                                            {story.user_id && !story.is_anonymous && currentUser && story.user_id !== currentUser && (
                                                <button
                                                    onClick={() => openChat(story.user_id!)}
                                                    className="hover:text-ember transition-colors"
                                                    title="Message Author"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                            )}

                                            <button className="hover:text-stone-300">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <CommentSection storyId={story.id} />
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            <div className="h-20" /> {/* Spacer for Nav */}
        </div>
    );
}

function LikeButton({ count, onClick }: { count: number, onClick: () => void }) {
    const [liked, setLiked] = useState(false);

    return (
        <button
            onClick={() => {
                if (liked) return; // Prevent double spam in UI for now
                setLiked(true);
                onClick();
            }}
            className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "hover:text-ember"}`}
        >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            <span className="text-xs">{count}</span>
        </button>
    );
}
