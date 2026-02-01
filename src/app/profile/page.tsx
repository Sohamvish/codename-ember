"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CandleFlame } from "@/components/ui/CandleFlame";
import { Settings, Shield, Moon, LogOut } from "lucide-react";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Database } from "@/types/supabase";
import { useToast } from "@/components/ui/Toast";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Story = Database['public']['Tables']['stories']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ candlesLit: 0, livesTouched: 0, streaks: "1 day" });
    const [myStories, setMyStories] = useState<Story[]>([]);
    const [myComments, setMyComments] = useState<Comment[]>([]);
    const supabase = createClient();
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/signup");
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (data) setProfile(data);

            // Fetch Stories (for history and metrics)
            const { data: stories } = await supabase
                .from('stories')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (stories) {
                setMyStories(stories);
                const candlesLit = stories.length;

                // Fetch Comments for "Lives Touched" - comments ON my stories
                const storyIds = stories.map(s => s.id);
                let livesTouched = 0;

                if (storyIds.length > 0) {
                    const { data: commentsOnMyStories } = await supabase
                        .from('comments')
                        .select('*')
                        .in('story_id', storyIds)
                        .order('created_at', { ascending: false });

                    if (commentsOnMyStories) {
                        livesTouched = commentsOnMyStories.length;
                    }
                }

                // Fetch MY comments (for display)
                const { data: myComments } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (myComments) {
                    setMyComments(myComments);
                }

                setMetrics({
                    candlesLit,
                    livesTouched,
                    streaks: "1 day"
                });
            }

            setLoading(false);

            // Set up realtime subscription for comments on MY stories
            const channel = supabase
                .channel('profile-comments')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'comments'
                    },
                    async (payload) => {
                        console.log('Comment change detected:', payload);
                        // Refetch stories to get updated story IDs
                        const { data: updatedStories } = await supabase
                            .from('stories')
                            .select('id')
                            .eq('user_id', user.id);

                        if (updatedStories && updatedStories.length > 0) {
                            const storyIds = updatedStories.map(s => s.id);
                            const { count } = await supabase
                                .from('comments')
                                .select('*', { count: 'exact', head: true })
                                .in('story_id', storyIds);

                            setMetrics(prev => ({ ...prev, livesTouched: count || 0 }));
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };
        fetchProfile();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-500">Loading...</div>;

    return (
        <div className="min-h-screen p-4 pt-12 max-w-xl mx-auto space-y-8">

            <header className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-800 to-black border border-stone-700 flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <CandleFlame size="sm" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-midnight" title="Online / Safe" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-stone-200">{profile?.username || "Anonymous Keeper"}</h1>
                    <p className="text-stone-500 text-sm">Member since {new Date().getFullYear()}</p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Candles Lit", sub: "(Stories)", val: metrics.candlesLit.toString() },
                    { label: "Lives Touched", sub: "(Comments)", val: metrics.livesTouched.toString() },
                    { label: "Streaks", sub: "", val: metrics.streaks },
                ].map((stat, i) => (
                    <GlassCard key={i} className="p-4 flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-xl font-bold text-ember-glow">{stat.val}</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-stone-500">{stat.label}</span>
                            {stat.sub && <span className="text-[8px] text-stone-600">{stat.sub}</span>}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* My History */}
            <div className="space-y-8">
                {/* Stories */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest ml-1">My Candles</h2>
                    {myStories.length === 0 ? (
                        <p className="text-stone-600 text-sm italic ml-1">You haven't lit any candles yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {myStories.map(story => (
                                <GlassCard key={story.id} className="p-4 flex items-center justify-between group">
                                    <div className="truncate flex-1 pr-4">
                                        <p className="text-stone-300 text-sm truncate">{story.content}</p>
                                        <p className="text-[10px] text-stone-500 mt-1">
                                            {new Date(story.created_at).toLocaleDateString()} • {story.likes_count || 0} Likes
                                        </p>
                                    </div>
                                    <div className="text-xs text-stone-500">
                                        {story.is_anonymous ? "Anon" : "Public"}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comments */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest ml-1">My Comments</h2>
                    {myComments.length === 0 ? (
                        <p className="text-stone-600 text-sm italic ml-1">You haven't reached out to anyone yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {myComments.map(comment => (
                                <GlassCard key={comment.id} className="p-4 flex flex-col gap-2 group">
                                    <p className="text-stone-300 text-sm">"{comment.content}"</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-stone-500">
                                            On Story #{comment.story_id} • {new Date(comment.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest ml-1">Settings</h2>

                <GlassCard className="p-0 overflow-hidden">
                    <SettingItem icon={Shield} label="Privacy & Anonymity" onClick={() => alert("Privacy Settings: Coming Soon")} />
                    <div className="h-px bg-white/5" />
                    <SettingItem icon={Moon} label="Appearance" onClick={() => alert("Dark Mode is enabled by default.")} />
                    <div className="h-px bg-white/5" />
                    <SettingItem icon={Settings} label="Account Settings" onClick={() => alert(`ID: ${profile?.id}`)} />
                </GlassCard>

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-900/30 text-red-400 hover:bg-red-950/20 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Sign Out & Clear Data</span>
                </button>
            </div>

            <div className="h-20" />
        </div>
    );
}

function SettingItem({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
        >
            <div className="flex items-center gap-3 text-stone-300">
                <Icon size={18} />
                <span>{label}</span>
            </div>
            <div className="text-stone-600">
                {/* Chevron Right */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
        </button>
    )
}
