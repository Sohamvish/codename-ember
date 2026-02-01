"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        setLoading(true);

        const { error } = await supabase.from('comments').insert({
            story_id: storyId,
            content: newComment,
            is_anonymous: false // Can add toggle later
            // user_id defaults to auth user
        });

        if (!error) {
            setNewComment("");
            fetchComments(); // Refresh list
        } else {
            alert("Failed to post comment");
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
        </div>
    );
}
