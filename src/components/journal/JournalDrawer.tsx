"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Book, Flame, Calendar, Send, Download, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { BurnAnimation } from "@/components/ui/BurnAnimation";
import jsPDF from "jspdf";

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
    const [mode, setMode] = useState<"keep" | "let_go">("keep");
    const [isBurning, setIsBurning] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const [showSuggestion, setShowSuggestion] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const supabase = createClient();
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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
        if (!user) return;

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

    const handleAction = async () => {
        if (!newEntry.trim()) return;

        if (mode === "let_go") {
            setIsBurning(true);
            return; // Animation handles the rest via onComplete callback
        }

        // Keep Mode (Save to DB)
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

    const handleBurnComplete = () => {
        setNewEntry("");
        setIsBurning(false);
        // Optional: Show a toast here "Burden released."
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        let yPosition = 30;

        // Orange color for accents
        const emberOrange: [number, number, number] = [245, 158, 11]; // #f59e0b
        const black: [number, number, number] = [0, 0, 0];

        // Header with orange accent bar
        doc.setFillColor(...emberOrange);
        doc.rect(0, 0, 210, 15, 'F');

        // Title
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("My Journal", 20, 10);

        // Subtitle
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Exported on ${new Date().toLocaleDateString()}`, 20, 20);

        yPosition = 35;

        // Reset text color to black for content
        doc.setTextColor(...black);

        Object.entries(groupedEntries).forEach(([date, dayEntries]) => {
            if (yPosition > 260) {
                doc.addPage();
                yPosition = 25;
            }

            // Date header with orange accent
            doc.setFillColor(...emberOrange);
            doc.rect(15, yPosition - 6, 4, 8, 'F');

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...black);
            doc.text(date, 25, yPosition);
            yPosition += 12;

            dayEntries.forEach((entry) => {
                const lines = doc.splitTextToSize(entry.content, 165);
                const contentHeight = lines.length * 7;

                if (yPosition + contentHeight + 15 > 280) {
                    doc.addPage();
                    yPosition = 25;
                }

                // Entry content
                doc.setFontSize(13);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(40, 40, 40);
                doc.text(lines, 25, yPosition);
                yPosition += contentHeight + 3;

                // Timestamp
                doc.setFontSize(9);
                doc.setTextColor(128, 128, 128);
                doc.text(new Date(entry.created_at).toLocaleString(), 25, yPosition);
                yPosition += 12;

                // Subtle separator line
                doc.setDrawColor(245, 158, 11);
                doc.setLineWidth(0.3);
                doc.line(25, yPosition, 185, yPosition);
                yPosition += 8;
            });

            yPosition += 3;
        });

        // Footer on last page
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(128, 128, 128);
            doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        }

        doc.save(`journal-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const fetchSuggestion = async (text: string) => {
        if (text.length < 10) {
            setSuggestion("");
            setShowSuggestion(false);
            return;
        }

        try {
            const response = await fetch("/api/autocomplete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();
            if (data.suggestion) {
                setSuggestion(data.suggestion);
                setShowSuggestion(true);
            }
        } catch (error) {
            console.error("Autocomplete error:", error);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setNewEntry(text);

        // Debounce autocomplete
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (mode === "keep") {
                fetchSuggestion(text);
            }
        }, 1000);
    };

    const acceptSuggestion = () => {
        setNewEntry(newEntry + " " + suggestion);
        setSuggestion("");
        setShowSuggestion(false);
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={exportToPDF}
                                    disabled={entries.length === 0}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-ember disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Export to PDF"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">

                            {/* Mode Toggle */}
                            <div className="flex gap-2 mb-2 bg-stone-900/50 p-1 rounded-lg border border-white/5 w-fit">
                                <button
                                    onClick={() => setMode("keep")}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                        mode === "keep"
                                            ? "bg-stone-800 text-stone-200 shadow-sm"
                                            : "text-stone-500 hover:text-stone-300"
                                    )}
                                >
                                    Keep
                                </button>
                                <button
                                    onClick={() => setMode("let_go")}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1",
                                        mode === "let_go"
                                            ? "bg-orange-900/30 text-orange-200 shadow-sm border border-orange-500/20"
                                            : "text-stone-500 hover:text-orange-400"
                                    )}
                                >
                                    <Flame size={12} /> Let Go
                                </button>
                            </div>

                            {/* New Entry Input */}
                            <div className={cn(
                                "relative rounded-xl p-4 border transition-all duration-[1400ms] delay-[800ms] ease-in overflow-hidden", // Wait 0.8s, then fly off in 1.4s
                                mode === "let_go"
                                    ? "bg-orange-950/10 border-orange-900/30 shadow-[inset_0_0_20px_rgba(251,146,60,0.05)]"
                                    : "bg-black/20 border-stone-800 focus-within:border-ember/50",
                                isBurning && "translate-y-[-800px] rotate-12 opacity-0 scale-90"
                            )}>
                                {isBurning && <BurnAnimation onComplete={handleBurnComplete} />}

                                <textarea
                                    ref={textareaRef}
                                    value={newEntry}
                                    onChange={handleTextChange}
                                    placeholder={mode === "let_go"
                                        ? "Pour it out. It won't be saved."
                                        : "What's on your mind today?"}
                                    className={cn(
                                        "w-full bg-transparent border-none outline-none focus:ring-0 resize-none min-h-[120px] placeholder:text-stone-600 transition-all duration-[1400ms] delay-[800ms]",
                                        mode === "let_go" ? "text-orange-100/90" : "text-stone-200",
                                        isBurning && "opacity-0 translate-y-[-400px] rotate-6"
                                    )}
                                />

                                {/* AI Suggestion */}
                                {showSuggestion && suggestion && mode === "keep" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 p-2 bg-ember/10 border border-ember/20 rounded-lg flex items-center gap-2 text-sm"
                                    >
                                        <Sparkles size={14} className="text-ember" />
                                        <span className="text-stone-300 flex-1">{suggestion}</span>
                                        <button
                                            onClick={acceptSuggestion}
                                            className="text-xs px-2 py-1 bg-ember/20 hover:bg-ember/30 rounded text-ember transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => setShowSuggestion(false)}
                                            className="text-xs text-stone-500 hover:text-stone-300"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.div>
                                )}

                                <div className="flex justify-end mt-2 relative z-10">
                                    <button
                                        onClick={handleAction}
                                        disabled={saving || isBurning || !newEntry.trim()}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                            mode === "let_go"
                                                ? "bg-gradient-to-r from-orange-700 to-red-600 text-white hover:brightness-110 shadow-lg shadow-orange-900/20"
                                                : "bg-ember text-black hover:bg-ember-glow"
                                        )}
                                    >
                                        {saving ? "Saving..." : (
                                            mode === "let_go" ? <><Flame size={14} /> Cast to Fire</> : <><Send size={14} /> Save Entry</>
                                        )}
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
