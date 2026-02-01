"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { MessageCircle, Send, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ModerationWarningModal } from "@/components/ui/ModerationWarningModal";
import { BannedModal } from "@/components/ui/BannedModal";

type Comment = Database['public']['Tables']['comments']['Row'];

interface CommentSectionProps {
    storyId: number;
    initiallyOpen?: boolean;
}

export function CommentSection({ storyId, initiallyOpen = false }: CommentSectionProps) {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [warningModalOpen, setWarningModalOpen] = useState(false);
    const [bannedModalOpen, setBannedModalOpen] = useState(false);
    const [moderationReason, setModerationReason] = useState("");
    const [isBanned, setIsBanned] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen && comments.length === 0) {
            fetchComments();
        }
    }, [isOpen]);

    const fetchComments = async () => {
        const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('story_id', storyId)
            .order('created_at', { ascending: true });

        if (data) setComments(data);
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        if (isBanned) {
            setBannedModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            // Step 1: Check if user is already banned
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please log in to comment");
                setLoading(false);
                return;
            }

            const { data: moderationData } = await supabase
                .from('user_moderation')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (moderationData?.is_banned) {
                setIsBanned(true);
                setModerationReason(moderationData.ban_reason || "Repeated violations of community guidelines");
                setBannedModalOpen(true);
                setLoading(false);
                return;
            }

            // Step 2: Moderate content with Snowflake Cortex
            console.log("🔍 Checking content for toxicity:", newComment);
            const moderationResponse = await fetch('/api/moderate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            console.log("📡 Moderation API response status:", moderationResponse.status);
            const moderation = await moderationResponse.json();
            console.log("🤖 Moderation result:", moderation);

            if (moderation.isToxic) {
                // Content is toxic - check strike count
                const currentStrikes = moderationData?.strike_count || 0;

                if (currentStrikes === 0) {
                    // First offense - warn and increment strike
                    await supabase.from('user_moderation').upsert({
                        user_id: user.id,
                        strike_count: 1,
                        updated_at: new Date().toISOString(),
                    });

                    // Log the warning
                    await supabase.from('moderation_logs').insert({
                        user_id: user.id,
                        content_type: 'comment',
                        flagged_content: newComment,
                        ai_reason: moderation.reason,
                        action_taken: 'warning',
                    });

                    setModerationReason(moderation.reason);
                    setWarningModalOpen(true);
                    setNewComment(""); // Clear the toxic comment
                } else {
                    // Second offense - permanent ban
                    await supabase.from('user_moderation').upsert({
                        user_id: user.id,
                        strike_count: currentStrikes + 1,
                        is_banned: true,
                        ban_reason: moderation.reason,
                        banned_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });

                    // Log the ban
                    await supabase.from('moderation_logs').insert({
                        user_id: user.id,
                        content_type: 'comment',
                        flagged_content: newComment,
                        ai_reason: moderation.reason,
                        action_taken: 'ban',
                    });

                    setIsBanned(true);
                    setModerationReason(moderation.reason);
                    setBannedModalOpen(true);
                    setNewComment("");
                }

                setLoading(false);
                return;
            }

            // Step 3: Content is safe - post comment
            const { error } = await supabase.from('comments').insert({
                story_id: storyId,
                content: newComment,
                is_anonymous: false,
            });

            if (!error) {
                setNewComment("");
                fetchComments();
            } else {
                alert("Failed to post comment");
            }
        } catch (error) {
            console.error("Comment posting error:", error);
            alert("An error occurred. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="mt-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-300 transition-colors text-xs"
            >
                <MessageCircle size={16} />
                <span>{comments.length > 0 ? `${comments.length} Comments` : "Reply"}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pl-4 border-l border-white/10 space-y-4">
                            {/* Comments List */}
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="text-sm">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-semibold text-ember/80">
                                                {comment.is_anonymous ? "Anonymous" : "User"}
                                            </span>
                                            <span className="text-[10px] text-stone-600">
                                                {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-stone-300 text-sm mt-0.5">{comment.content}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <button
                                                onClick={async () => {
                                                    const newComments = comments.map(c =>
                                                        c.id === comment.id ? { ...c, likes_count: (c.likes_count || 0) + 1 } : c
                                                    );
                                                    setComments(newComments);

                                                    await supabase
                                                        .from('comments')
                                                        .update({ likes_count: (comment.likes_count || 0) + 1 })
                                                        .eq('id', comment.id);
                                                }}
                                                className="flex items-center gap-1 text-stone-500 hover:text-red-400 transition-colors"
                                            >
                                                <Heart size={12} />
                                                <span className="text-[10px]">{comment.likes_count || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="flex gap-2 items-end pt-2">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add to the warmth..."
                                    className="flex-1 bg-white/5 rounded-lg border border-white/10 p-2 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-ember/30 min-h-[60px] resize-none"
                                />
                                <button
                                    onClick={handlePostComment}
                                    disabled={loading || !newComment.trim()}
                                    className="p-2 rounded-lg bg-ember text-black disabled:opacity-50 hover:bg-ember-glow transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Moderation Modals */}
            <ModerationWarningModal
                isOpen={warningModalOpen}
                onClose={() => setWarningModalOpen(false)}
                reason={moderationReason}
            />
            <BannedModal
                isOpen={bannedModalOpen}
                reason={moderationReason}
            />
        </div>
    );
}
