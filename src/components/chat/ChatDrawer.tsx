"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ChevronLeft, Send, User } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

interface Profile {
    id: string;
    username: string;
    avatar_url: string | null;
}

interface Conversation {
    id: string;
    updated_at: string;
    // We will resolve the "other" participant manually for display
    otherUser?: Profile;
    participant1_id: string;
    participant2_id: string;
}

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
}

export function ChatDrawer() {
    const { isOpen, closeChat, activeConversationId, setActiveConversation, openChat, targetUserId } = useChat();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<"list" | "chat">("list");
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const supabase = createClient();

    // Initial Load
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUser(user.id);
        };
        getUser();
    }, []);

    // Handle Target User (Start Chat)
    useEffect(() => {
        const handleTargetUser = async () => {
            if (!isOpen || !targetUserId || !currentUser) return;
            setLoading(true);

            // 1. Fetch my conversations (raw)
            const { data: myConvos } = await supabase
                .from("conversations")
                .select("*")
                .or(`participant1_id.eq.${currentUser},participant2_id.eq.${currentUser}`);

            if (myConvos) {
                // 2. Client-side check
                const existing = myConvos.find((c: any) =>
                    (c.participant1_id === currentUser && c.participant2_id === targetUserId) ||
                    (c.participant1_id === targetUserId && c.participant2_id === currentUser)
                );

                if (existing) {
                    setActiveConversation(existing.id);
                } else {
                    // 3. Create new
                    if (currentUser === targetUserId) {
                        console.warn("Cannot create conversation with self");
                        setLoading(false);
                        return;
                    }

                    console.log("Creating conversation...", { currentUser, targetUserId });

                    const { data: newConvo, error } = await supabase
                        .from("conversations")
                        .insert({ participant1_id: currentUser, participant2_id: targetUserId })
                        .select()
                        .single();

                    if (newConvo) {
                        setActiveConversation(newConvo.id);
                        fetchConversations();
                    } else {
                        console.error("Failed to create conversation:", error);
                        console.error("Error details:", JSON.stringify(error, null, 2));
                        console.error("Payload:", { participant1_id: currentUser, participant2_id: targetUserId });

                        // If 403, it's RLS. If code is 23514, it's CHECK violation (self-msg)
                        if (error && error.code === "42501") {
                            console.error("RLS Policy Violation. User may not be authenticated or policy is missing.");
                        }
                    }
                }
            }
            setLoading(false);
        };

        if (targetUserId && currentUser) {
            handleTargetUser();
        }
    }, [isOpen, targetUserId, currentUser]);

    // Fetch Conversations when drawer opens
    useEffect(() => {
        if (isOpen && currentUser) {
            fetchConversations();
        }
    }, [isOpen, currentUser]);

    // Handle Active Conversation Switch
    useEffect(() => {
        if (activeConversationId) {
            setView("chat");
            fetchMessages(activeConversationId);
        } else {
            setView("list");
            setMessages([]);
        }
    }, [activeConversationId]);

    const fetchConversations = async () => {
        if (!currentUser) return;
        setLoading(true);

        // 1. Fetch conversations (raw, no join to avoid 400 on auth.users)
        const { data: convos, error } = await supabase
            .from("conversations")
            .select('*')
            .or(`participant1_id.eq.${currentUser},participant2_id.eq.${currentUser}`)
            .order("updated_at", { ascending: false });

        if (!error && convos) {
            // 2. Collect all User IDs we need to fetch profiles for
            const userIds = new Set<string>();
            convos.forEach((c: any) => {
                if (c.participant1_id !== currentUser) userIds.add(c.participant1_id);
                if (c.participant2_id !== currentUser) userIds.add(c.participant2_id);
            });

            // 3. Fetch Profiles for these users
            const { data: profiles } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", Array.from(userIds));

            const profileMap = (profiles || []).reduce((acc: any, p: any) => {
                acc[p.id] = p;
                return acc;
            }, {});

            // 4. Map back to creating the formatted object
            const formatted = convos.map((c: any) => {
                const isP1 = c.participant1_id === currentUser;
                const otherId = isP1 ? c.participant2_id : c.participant1_id;
                const otherUser = profileMap[otherId] || { id: otherId, username: "Unknown User", avatar_url: null };

                return {
                    ...c,
                    otherUser
                };
            });
            setConversations(formatted);
        } else {
            console.error("Error fetching conversations:", error);
        }
        setLoading(false);
    };

    const fetchMessages = async (convId: string) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: true });

        if (!error && data) {
            setMessages(data);
            scrollToBottom();
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConversationId || !currentUser) return;

        const { error } = await supabase.from("messages").insert({
            conversation_id: activeConversationId,
            sender_id: currentUser,
            content: newMessage,
        });

        if (!error) {
            setNewMessage("");
            fetchMessages(activeConversationId); // Refresh
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChat}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-stone-900 border-l border-white/10 shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-stone-900/50 backdrop-blur-xl">
                            <div className="flex items-center gap-2 text-ember">
                                {view === "chat" && (
                                    <button onClick={() => setActiveConversation(null)} className="mr-2 hover:bg-white/5 p-1 rounded-full">
                                        <ChevronLeft size={20} />
                                    </button>
                                )}
                                <MessageSquare size={20} />
                                <h2 className="font-serif text-lg tracking-wide">
                                    {view === "list" ? "Messages" : "Chat"}
                                </h2>
                            </div>
                            <button
                                onClick={closeChat}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden">
                            {view === "list" ? (
                                <div className="p-4 space-y-2">
                                    {conversations.length === 0 && !loading && (
                                        <div className="text-center text-stone-500 mt-10">No messages yet.</div>
                                    )}
                                    {conversations.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setActiveConversation(c.id)}
                                            className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
                                                {c.otherUser?.avatar_url ? (
                                                    <img src={c.otherUser.avatar_url} alt={c.otherUser.username} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-stone-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-stone-200">{c.otherUser?.username || "Unknown User"}</h3>
                                                <p className="text-xs text-stone-500 mt-1">Open conversation</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map(m => {
                                            const isMe = m.sender_id === currentUser;
                                            return (
                                                <div key={m.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                                                    <div className={cn(
                                                        "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group",
                                                        isMe
                                                            ? "bg-amber-500/90 text-stone-900 rounded-tr-sm"
                                                            : "bg-stone-800/90 text-stone-200 rounded-tl-sm border border-white/5"
                                                    )}>
                                                        {m.content}
                                                        <div className={cn(
                                                            "text-[10px] mt-1 space-x-1 flex items-center",
                                                            isMe ? "text-stone-800/60 justify-end" : "text-stone-500 justify-start"
                                                        )}>
                                                            <span>
                                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-white/5 bg-stone-900/50">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                                placeholder="Type a message..."
                                                className="flex-1 bg-black/20 border border-stone-800 rounded-full px-4 py-2 text-sm text-stone-200 focus:outline-none focus:border-ember/50"
                                            />
                                            <button
                                                onClick={sendMessage}
                                                disabled={!newMessage.trim()}
                                                className="p-2 bg-ember text-stone-900 rounded-full hover:bg-ember-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
