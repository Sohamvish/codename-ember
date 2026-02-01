"use client";

import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, Sparkles, Flower } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeditationPlayer } from "./MeditationPlayer";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export function EmberChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "I'm here. I'm listening. You can tell me anything." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [meditationAudio, setMeditationAudio] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startMeditation = async () => {
        if (loading) return;
        setLoading(true);
        setMessages(prev => [...prev, { role: "user", content: "Lead me through a guided meditation." }]);

        try {
            // 1. Get script from Gemini
            const chatRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, {
                        role: "user",
                        content: "Generate a short (3-4 sentences), calming breathing exercise script. Do not include 'User:' or 'Ember:' labels, just the text to be spoken."
                    }]
                }),
            });

            const chatData = await chatRes.json();

            if (!chatRes.ok || !chatData.text) {
                console.error("Chat API Error:", chatData);
                throw new Error(chatData.details || chatData.error || "Failed to generate script");
            }

            const script = chatData.text;

            setMessages(prev => [...prev, { role: "assistant", content: `Let's breathe together. 🌿 (Generating audio...) \n\n"${script}"` }]);

            // 2. Get Audio from ElevenLabs
            const audioRes = await fetch("/api/meditate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: script }),
            });

            if (!audioRes.ok) {
                const errData = await audioRes.json();
                console.error("Audio API Error:", errData);
                throw new Error(errData.details || "Audio generation failed");
            }

            const audioBlob = await audioRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setMeditationAudio(audioUrl);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble finding my voice right now, but I'm still here with you. 🧡" }]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                }),
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: `I'm having trouble. Error: ${data.details || data.error}`
                }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="flex flex-col h-[600px] w-full max-w-2xl mx-auto overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                    <Sparkles size={16} className="text-white mix-blend-overlay" />
                </div>
                <div>
                    <h3 className="text-stone-200 font-medium">Ember</h3>
                    <p className="text-stone-500 text-xs text-xs">Always here for you</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`
                                max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed
                                ${msg.role === "user"
                                    ? "bg-white/10 text-stone-200 rounded-tr-sm"
                                    : "bg-ember/10 border border-ember/20 text-stone-200 rounded-tl-sm shadow-[0_0_10px_rgba(251,146,60,0.05)]"}
                            `}
                        >
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-ember/5 border border-ember/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-ember/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-ember/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-ember/50 rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-black/20 border-t border-white/10 relative z-10 flex gap-2">
                <button
                    type="button"
                    onClick={startMeditation}
                    disabled={loading}
                    className="p-3.5 rounded-full bg-white/5 text-stone-400 hover:text-ember hover:bg-white/10 transition-colors border border-white/10"
                    title="Guided Meditation"
                >
                    <Flower size={20} />
                </button>
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-12 py-3.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-ember/50 focus:bg-white/10 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-ember to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_10px_rgba(251,146,60,0.4)] transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {meditationAudio && (
                    <MeditationPlayer
                        audioUrl={meditationAudio}
                        onClose={() => setMeditationAudio(null)}
                    />
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
