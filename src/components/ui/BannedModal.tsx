"use client";

import { motion } from "framer-motion";
import { Ban, Mail } from "lucide-react";

interface BannedModalProps {
    isOpen: boolean;
    reason?: string;
}

export function BannedModal({ isOpen, reason }: BannedModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md glass-panel p-8 rounded-2xl border-2 border-red-500/50"
            >
                {/* Ban Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-6 rounded-full bg-red-500/20">
                        <Ban size={64} className="text-red-500" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-4 text-red-500">
                    Account Banned
                </h2>

                {/* Message */}
                <div className="space-y-4 text-center">
                    <p className="text-xl font-semibold text-stone-200">
                        You have been permanently banned from this platform.
                    </p>

                    {reason && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                            <p className="text-sm text-red-200">
                                <strong>Reason:</strong> {reason}
                            </p>
                        </div>
                    )}

                    <p className="text-stone-400">
                        Your account has been flagged for repeated violations of our community guidelines.
                    </p>

                    {/* Contact Info */}
                    <div className="mt-6 p-4 rounded-lg bg-stone-800/50 border border-stone-700">
                        <p className="text-sm text-stone-300 mb-2">
                            If you believe this is a mistake, please contact us:
                        </p>
                        <a
                            href="mailto:ember@gmail.com"
                            className="flex items-center justify-center gap-2 text-ember hover:text-ember-glow transition-colors"
                        >
                            <Mail size={18} />
                            <span className="font-medium">ember@gmail.com</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
