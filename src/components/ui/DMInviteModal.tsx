"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface DMInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    postContent: string;
    recipientId: string;
    onSend: (message: string) => Promise<void>;
}

export function DMInviteModal({ isOpen, onClose, postContent, recipientId, onSend }: DMInviteModalProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedMessage, setSelectedMessage] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSuggestions();
        }
    }, [isOpen]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/generate-invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postContent,
                    requesterName: "User"
                }),
            });

            const data = await response.json();
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
            setSuggestions([
                "I saw your post and relate to it. I'd love to talk 1:1 maybe 😊",
                "Your story resonated with me. Would you be open to connecting?"
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        const message = customMessage || selectedMessage;
        if (!message.trim()) return;

        setSending(true);
        try {
            await onSend(message);
            onClose();
        } catch (error) {
            console.error("Failed to send invitation:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <GlassCard className="w-full max-w-lg bg-stone-900/95 border-white/10">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={20} className="text-ember" />
                                    <h3 className="text-lg font-semibold text-stone-200">Send Connection Request</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-stone-400">
                                    Choose a message or write your own to connect with this person:
                                </p>

                                {/* AI Suggestions */}
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="animate-spin text-ember" size={24} />
                                        <span className="ml-2 text-stone-400">Generating suggestions...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedMessage(suggestion);
                                                    setCustomMessage("");
                                                }}
                                                className={cn(
                                                    "w-full text-left p-3 rounded-lg border transition-all text-sm",
                                                    selectedMessage === suggestion
                                                        ? "bg-ember/20 border-ember text-stone-200"
                                                        : "bg-white/5 border-white/10 text-stone-300 hover:border-ember/30 hover:bg-white/10"
                                                )}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Custom Message */}
                                <div className="pt-2">
                                    <label className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                                        Or write your own:
                                    </label>
                                    <textarea
                                        value={customMessage}
                                        onChange={(e) => {
                                            setCustomMessage(e.target.value);
                                            setSelectedMessage("");
                                        }}
                                        placeholder="Type your message here..."
                                        className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-ember/50 resize-none min-h-[80px]"
                                    />
                                </div>

                                {/* Send Button */}
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg text-sm text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={sending || (!customMessage.trim() && !selectedMessage)}
                                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-ember to-orange-600 text-black font-semibold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Send Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
