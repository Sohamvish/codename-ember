"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function SignupPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize Supabase client
    const supabase = createClient();
    const router = useRouter();

    const handleAuth = async () => {
        setLoading(true);
        try {
            const { error } = isLogin
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

            if (error) {
                alert(error.message);
            } else {
                // Success!
                if (isLogin) {
                    router.push("/hearth");
                } else {
                    // Create Profile Row manually (redundancy for safety)
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await supabase.from('profiles').insert({
                            id: user.id,
                            username: email.split('@')[0], // Default username from email
                            avatar_url: null,
                            updated_at: new Date().toISOString(),
                        });
                    }
                    alert("Check your email for the confirmation link!");
                }
            }
        } catch (e: any) {
            alert("An error occurred: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-12 overflow-hidden relative">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,rgba(28,25,23,0)_70%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <CandleFlame size="md" className="mb-4" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-ember-glow to-ember bg-clip-text text-transparent">
                        {isLogin ? "Welcome Back" : "Join the Circle"}
                    </h1>
                    <p className="text-stone-400 text-sm mt-2">
                        {isLogin ? "Rekindle your light." : "Start your journey of courage."}
                    </p>
                </div>

                <GlassCard className="space-y-6 p-8 border-stone-800/50 bg-stone-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-ember transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full bg-black/20 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-soothe placeholder:text-stone-600 focus:outline-none focus:border-ember/50 focus:ring-1 focus:ring-ember/20 transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-ember transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-black/20 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-soothe placeholder:text-stone-600 focus:outline-none focus:border-ember/50 focus:ring-1 focus:ring-ember/20 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAuth}
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ember to-orange-600 text-black font-bold shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}</span>
                        {!loading && <ArrowRight size={18} />}
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-stone-800"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-stone-600">OR</span>
                        <div className="flex-grow border-t border-stone-800"></div>
                    </div>

                    <Link href="/hearth">
                        <button className="w-full py-3 rounded-xl border border-stone-800 bg-black/20 text-stone-400 hover:bg-black/40 hover:text-stone-200 transition-colors text-sm font-medium">
                            Continue as Guest
                        </button>
                    </Link>
                </GlassCard>

                <p className="text-center mt-6 text-xs text-stone-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-ember hover:underline underline-offset-4 font-medium"
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </p>

            </motion.div>
        </div>
    );
}
