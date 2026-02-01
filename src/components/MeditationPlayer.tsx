"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, X } from "lucide-react";

interface MeditationPlayerProps {
    audioUrl: string | null;
    onClose: () => void;
}

export function MeditationPlayer({ audioUrl, onClose }: MeditationPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioUrl) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(audioUrl);
            audioRef.current.onended = () => setIsPlaying(false);
            // Auto play when loaded
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error: any) => {
                    if (error?.name === "AbortError") return;
                    console.error("Autoplay failed:", error);
                });
            }
            setIsPlaying(true);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (!audioUrl) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <div className="bg-stone-900/90 border border-white/10 p-8 rounded-3xl max-w-sm w-full relative flex flex-col items-center gap-8 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-medium text-ember">Guided Meditation</h3>
                    <p className="text-sm text-stone-400">Follow the voice. Breathe.</p>
                </div>

                {/* Breathing Animation */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Outer glow */}
                    <motion.div
                        animate={{
                            scale: isPlaying ? [1, 1.2, 1] : 1,
                            opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3
                        }}
                        transition={{
                            duration: 8, // Slow breathing rhythm (4s in, 4s out)
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-full h-full rounded-full bg-ember/20 blur-xl"
                    />

                    {/* Core circle */}
                    <motion.div
                        animate={{
                            scale: isPlaying ? [0.8, 1, 0.8] : 0.9,
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-ember to-orange-600 shadow-[0_0_30px_rgba(251,146,60,0.4)] flex items-center justify-center"
                    >
                        <button
                            onClick={togglePlay}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors backdrop-blur-sm"
                        >
                            {isPlaying ? <Pause size={24} className="text-white fill-white" /> : <Play size={24} className="text-white fill-white pl-1" />}
                        </button>
                    </motion.div>
                </div>

                <div className="text-xs text-stone-600">
                    Voice powered by ElevenLabs
                </div>
            </div>
        </motion.div>
    );
}
