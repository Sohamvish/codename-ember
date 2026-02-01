"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { ArrowUp, Mic, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CrisisResourceModal } from "@/components/ui/CrisisResourceModal";

import { useToast } from "@/components/ui/Toast";

export default function SharePage() {
    const [content, setContent] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [crisisModalOpen, setCrisisModalOpen] = useState(false);
    const [crisisType, setCrisisType] = useState<"suicide" | "harassment" | "abuse">("suicide");
    const [userBanned, setUserBanned] = useState(false);
    const [warningCount, setWarningCount] = useState(0);

    const supabase = createClient();
    const router = useRouter();
    const { showToast } = useToast();
    const tags = ["Courage", "Healing", "Hope", "Support", "Venting", "Advice"];

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const response = await fetch("/api/check-user-status", { method: "POST" });
            const data = await response.json();

            if (data.banned) {
                setUserBanned(true);
                showToast(data.message, "error");
            }
            setWarningCount(data.warningCount || 0);
        } catch (error) {
            console.error("Error checking user status:", error);
        }
    };

    const handlePost = async () => {
        if (!content || !selectedTag) return;
        if (userBanned) {
            showToast("Your account has been banned. Contact ember@gmail.com if you think this is wrong.", "error");
            return;
        }

        setLoading(true);
        try {
            // Step 1: Moderate content
            const moderationResponse = await fetch("/api/moderate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: content })
            });

            const moderation = await moderationResponse.json();
            console.log("Moderation result:", moderation);

            // Step 2: Handle crisis detection
            if (moderation.crisis) {
                setCrisisType(moderation.crisis);
                setCrisisModalOpen(true);
                setLoading(false);
                return; // Don't post yet, show resources first
            }

            // Step 3: Handle trolling/harassment
            if (moderation.severity === "ban") {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const newWarningCount = warningCount + 1;

                    if (newWarningCount >= 2) {
                        // Permanent ban
                        await supabase
                            .from('profiles')
                            .update({
                                is_banned: true,
                                ban_reason: "Harassment and trolling",
                                banned_at: new Date().toISOString()
                            })
                            .eq('id', user.id);

                        setUserBanned(true);
                        showToast("Your account has been banned. If you think this is wrong, please contact our team at ember@gmail.com", "error");
                        setLoading(false);
                        return;
                    } else {
                        // First warning
                        await supabase
                            .from('profiles')
                            .update({ warning_count: newWarningCount })
                            .eq('id', user.id);

                        setWarningCount(newWarningCount);
                        showToast("⚠️ Warning: Your message contains harassment or trolling. One more violation will result in a permanent ban.", "error");
                        setLoading(false);
                        return;
                    }
                }
            }

            // Step 4: Post if safe
            await proceedWithPost();

        } catch (e: any) {
            console.error(e);
            showToast("Failed to share light: " + e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const proceedWithPost = async () => {
        console.log("Proceeding with post insertion...");
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("User retrieved:", user?.id);

            // Fix: tag expects string[] array, not string
            const payload = {
                content,
                tag: selectedTag ? [selectedTag] : [], // Wrap in array
                is_anonymous: isAnonymous,
                user_id: user?.id || null
            };
            console.log("Payload:", payload);

            const { error } = await supabase.from('stories').insert(payload);

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            console.log("Post success!");
            // Reset and redirect
            showToast("Your candle has been lit. 🔥", "success");
            router.push('/hearth');
        } catch (e: any) {
            console.error("Post failed:", e);
            showToast("Failed to share light: " + (e.message || e.details || "Unknown error"), "error");
        }
    };

    return (
        <div className={cn(
            "min-h-screen p-4 pt-12 max-w-xl mx-auto flex flex-col items-center transition-colors duration-300",
            isDarkMode ? "bg-stone-950" : "bg-white"
        )}>

            <div className="w-full mb-6 flex items-center justify-between">
                <h1 className={cn(
                    "text-2xl font-bold transition-colors",
                    isDarkMode ? "text-stone-200" : "text-stone-900"
                )}>Share your light</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={cn(
                            "p-2 rounded-full transition-all",
                            isDarkMode
                                ? "bg-white/10 text-amber-400 hover:bg-white/20"
                                : "bg-stone-900/10 text-stone-700 hover:bg-stone-900/20"
                        )}
                        title={isDarkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <CandleFlame size="sm" />
                </div>
            </div>

            <GlassCard className={cn(
                "w-full flex-1 flex flex-col mb-20 transition-colors",
                isDarkMode ? "bg-stone-900/40" : "bg-white/80 border-stone-200"
            )}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? This space is safe..."
                    className={cn(
                        "w-full flex-1 bg-transparent resize-none outline-none text-lg leading-relaxed font-light p-2 transition-colors",
                        isDarkMode
                            ? "text-stone-200 placeholder:text-stone-600"
                            : "text-stone-900 placeholder:text-stone-400"
                    )}
                />

                <div className="mt-6 space-y-4">
                    {/* Anonymity Toggle */}
                    <div className={cn(
                        "flex items-center justify-between pb-4 border-b transition-colors",
                        isDarkMode ? "border-white/5" : "border-stone-200"
                    )}>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-sm font-medium transition-colors",
                                isDarkMode ? "text-stone-300" : "text-stone-700"
                            )}>Post Anonymously</span>
                            <span className={cn(
                                "text-xs transition-colors",
                                isDarkMode ? "text-stone-500" : "text-stone-400"
                            )}>Hide your username from this post</span>
                        </div>
                        <button
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                isAnonymous ? "bg-ember" : (isDarkMode ? "bg-stone-700" : "bg-stone-300")
                            )}
                        >
                            <motion.div
                                animate={{ x: isAnonymous ? 26 : 2 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>

                    <p className={cn(
                        "text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-colors",
                        isDarkMode ? "text-stone-500" : "text-stone-600"
                    )}>
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
                                        : isDarkMode
                                            ? "bg-white/5 border-white/10 text-stone-400 hover:border-ember/30 hover:text-stone-200"
                                            : "bg-stone-100 border-stone-200 text-stone-600 hover:border-ember/30 hover:text-stone-900"
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

            {/* Crisis Resource Modal */}
            <CrisisResourceModal
                isOpen={crisisModalOpen}
                onClose={() => setCrisisModalOpen(false)}
                crisisType={crisisType}
                onProceed={async () => {
                    setLoading(true);
                    await proceedWithPost();
                    setLoading(false);
                }}
            />

        </div>
    );
}
