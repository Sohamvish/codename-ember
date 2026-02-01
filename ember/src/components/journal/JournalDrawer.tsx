"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Book, ChevronDown, Calendar, Send } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface JournalEntry {
    id: string;
    content: string;
    created_at: string;
}

interface JournalDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function JournalDrawer({ isOpen, onClose }: JournalDrawerProps) {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const supabase = createClient();

    // Group entries by date
    const groupedEntries = entries.reduce((acc, entry) => {
        const date = new Date(entry.created_at).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {} as Record<string, JournalEntry[]>);

    useEffect(() => {
        if (isOpen) {
            fetchEntries();
        }
    }, [isOpen]);

    const fetchEntries = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Handle no user (maybe show login prompt or just return)

        const { data, error } = await supabase
            .from("journal_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setEntries(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!newEntry.trim()) return;
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.from("journal_entries").insert({
                user_id: user.id,
                content: newEntry,
            });

            if (!error) {
                setNewEntry("");
                fetchEntries(); // Refresh list
            } else {
                alert("Failed to save entry");
            }
        }
        setSaving(false);
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-stone-900 border-l border-white/10 shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-stone-900/50 backdrop-blur-xl">
                            <div className="flex items-center gap-2 text-ember">
                                <Book size={20} />
                                <h2 className="font-serif text-lg tracking-wide">Journal</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* New Entry Input */}
                            <div className="bg-black/20 rounded-xl p-4 border border-stone-800 focus-within:border-ember/50 transition-colors">
                                <textarea
                                    ref={textareaRef}
                                    value={newEntry}
                                    onChange={(e) => setNewEntry(e.target.value)}
                                    placeholder="What's on your mind today?"
                                    className="w-full bg-transparent border-none outline-none focus:ring-0 resize-none min-h-[120px] text-stone-200 placeholder:text-stone-600"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !newEntry.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-ember text-black rounded-lg text-sm font-medium hover:bg-ember-glow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {saving ? "Saving..." : <><Send size={14} /> Save Entry</>}
                                    </button>
                                </div>
                            </div>

                            {/* Past Entries */}
                            <div className="space-y-6">
                                {loading ? (
                                    <div className="text-center text-stone-500 py-8">Loading your thoughts...</div>
                                ) : (
                                    Object.entries(groupedEntries).map(([date, dayEntries]) => (
                                        <div key={date} className="space-y-3">
                                            <div className="sticky top-0 bg-stone-900/95 backdrop-blur py-2 z-10 flex items-center gap-2 text-xs font-medium text-ember-glow uppercase tracking-wider">
                                                <Calendar size={12} />
                                                {date}
                                            </div>
                                            <div className="space-y-3 pl-4 border-l border-white/5">
                                                {dayEntries.map(entry => (
                                                    <div key={entry.id} className="group relative">
                                                        <div className="absolute -left-[1.35rem] top-2 w-2 h-2 rounded-full bg-stone-800 border border-stone-600 group-hover:bg-ember group-hover:border-ember transition-colors" />
                                                        <div className="text-stone-300 text-sm whitespace-pre-wrap leading-relaxed font-light">
                                                            {entry.content}
                                                        </div>
                                                        <div className="mt-1 text-[10px] text-stone-600">
                                                            {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {!loading && entries.length === 0 && (
                                    <div className="text-center text-stone-600 py-12 italic text-sm">
                                        Your journal is empty. Start writing today.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
