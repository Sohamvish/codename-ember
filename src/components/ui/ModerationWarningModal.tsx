"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ModerationWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
}

export function ModerationWarningModal({ isOpen, onClose, reason }: ModerationWarningModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md glass-panel p-6 rounded-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-stone-400" />
                    </button>

                    {/* Warning Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-amber-500/20">
                            <AlertTriangle size={48} className="text-amber-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center mb-2 text-amber-500">
                        Content Warning
                    </h2>

                    {/* Message */}
                    <div className="space-y-4 text-center">
                        <p className="text-stone-300">
                            Your comment has been flagged by our AI moderation system.
                        </p>

                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <p className="text-sm text-amber-200">
                                <strong>Reason:</strong> {reason}
                            </p>
                        </div>

                        <p className="text-lg font-semibold text-ember">
                            ⚠️ This is your first warning
                        </p>

                        <p className="text-sm text-stone-400">
                            Ember is a safe space for support and encouragement.
                            Please be kind and respectful to others.
                        </p>

                        <p className="text-sm text-red-400 font-medium">
                            A second violation will result in a permanent ban.
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full mt-6 px-6 py-3 bg-ember hover:bg-ember-glow text-white rounded-full font-medium transition-colors"
                    >
                        I Understand
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
