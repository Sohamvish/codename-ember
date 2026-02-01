"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Heart, AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface CrisisResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    crisisType: "suicide" | "harassment" | "abuse";
    onProceed?: () => void;
}

export function CrisisResourceModal({ isOpen, onClose, crisisType, onProceed }: CrisisResourceModalProps) {
    const resources = {
        suicide: {
            title: "You're Not Alone",
            message: "We're concerned about what you shared. Please know that you matter, and help is available right now.",
            hotlines: [
                { name: "988 Suicide & Crisis Lifeline", number: "988", description: "24/7 support" },
                { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Free 24/7 text support" },
                { name: "International Association for Suicide Prevention", number: "Visit findahelpline.com", description: "Global resources" }
            ]
        },
        harassment: {
            title: "We're Here to Support You",
            message: "What you experienced is not okay. You deserve support and safety.",
            hotlines: [
                { name: "RAINN National Sexual Assault Hotline", number: "1-800-656-4673", description: "24/7 confidential support" },
                { name: "National Domestic Violence Hotline", number: "1-800-799-7233", description: "24/7 support and resources" },
                { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Free 24/7 text support" }
            ]
        },
        abuse: {
            title: "You Deserve Safety",
            message: "What happened to you is serious. There are people ready to help you right now.",
            hotlines: [
                { name: "National Domestic Violence Hotline", number: "1-800-799-7233", description: "24/7 confidential support" },
                { name: "Childhelp National Child Abuse Hotline", number: "1-800-422-4453", description: "24/7 support for children and adults" },
                { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Free 24/7 text support" }
            ]
        }
    };

    const resource = resources[crisisType];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <GlassCard className="w-full max-w-md bg-stone-900/98 border-orange-500/30 shadow-2xl">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-orange-500/20 rounded-full">
                                        <Heart className="text-orange-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-stone-100">{resource.title}</h3>
                                        <p className="text-sm text-stone-300 mt-1">{resource.message}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
                                    <Phone size={16} />
                                    <span>Immediate Help Available</span>
                                </div>

                                {resource.hotlines.map((hotline, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                        <div className="font-medium text-stone-200">{hotline.name}</div>
                                        <div className="text-lg font-bold text-orange-400 mt-1">{hotline.number}</div>
                                        <div className="text-xs text-stone-400 mt-1">{hotline.description}</div>
                                    </div>
                                ))}

                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                                    <p className="text-xs text-blue-200">
                                        If you're in immediate danger, please call 911 or your local emergency services.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-white/10 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors font-medium"
                                >
                                    I'll Get Help
                                </button>
                                {onProceed && (
                                    <button
                                        onClick={() => {
                                            onProceed();
                                            onClose();
                                        }}
                                        className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-ember to-orange-600 text-black font-semibold hover:brightness-110 transition-all"
                                    >
                                        Continue Posting
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
