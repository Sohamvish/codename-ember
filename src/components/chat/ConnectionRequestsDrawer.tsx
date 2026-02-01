"use client";

import { useEffect, useState } from "react";
import { X, Check, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Database } from "@/types/supabase";

type ConnectionRequest = {
    id: string;
    sender_id: string;
    recipient_id: string;
    message: string | null;
    status: string;
    created_at: string;
    sender_profile?: {
        username: string;
        avatar_url?: string;
    };
};

interface ConnectionRequestsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectionRequestsDrawer({ isOpen, onClose }: ConnectionRequestsDrawerProps) {
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            fetchRequests();
        }
    }, [isOpen]);

    const fetchRequests = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: requestsData } = await supabase
            .from('connection_requests')
            .select('*')
            .eq('recipient_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (requestsData) {
            // Fetch sender profiles
            const senderIds = requestsData.map(r => r.sender_id);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', senderIds);

            const requestsWithProfiles = requestsData.map(req => ({
                ...req,
                sender_profile: profiles?.find(p => p.id === req.sender_id)
            }));

            setRequests(requestsWithProfiles);
        }
        setLoading(false);
    };

    const handleAccept = async (requestId: string, senderId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Update request status
        await supabase
            .from('connection_requests')
            .update({ status: 'accepted', updated_at: new Date().toISOString() })
            .eq('id', requestId);

        // Create conversation
        await supabase
            .from('conversations')
            .insert({
                participant1_id: senderId,
                participant2_id: user.id
            });

        // Refresh requests
        fetchRequests();
    };

    const handleReject = async (requestId: string) => {
        await supabase
            .from('connection_requests')
            .update({ status: 'rejected', updated_at: new Date().toISOString() })
            .eq('id', requestId);

        fetchRequests();
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-midnight border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-stone-200">Connection Requests</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} className="text-stone-400" />
                            </button>
                        </div>

                        {/* Requests List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {loading ? (
                                <div className="text-center text-stone-500 py-8">Loading...</div>
                            ) : requests.length === 0 ? (
                                <div className="text-center text-stone-500 py-8">
                                    No pending requests
                                </div>
                            ) : (
                                requests.map((request) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
                                    >
                                        {/* User Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ember to-orange-600 flex items-center justify-center">
                                                {request.sender_profile?.avatar_url ? (
                                                    <img
                                                        src={request.sender_profile.avatar_url}
                                                        alt="Avatar"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <UserCircle size={24} className="text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-stone-200">
                                                    {request.sender_profile?.username || "Anonymous"}
                                                </p>
                                                <p className="text-xs text-stone-500">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        {request.message && (
                                            <p className="text-sm text-stone-400 italic">
                                                "{request.message}"
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAccept(request.id, request.sender_id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl transition-colors border border-green-600/30"
                                            >
                                                <Check size={18} />
                                                <span className="text-sm font-medium">Accept</span>
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors border border-red-600/30"
                                            >
                                                <X size={18} />
                                                <span className="text-sm font-medium">Reject</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
