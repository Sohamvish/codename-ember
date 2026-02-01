import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                banned: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        // Check user's ban status
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_banned, ban_reason, warning_count')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error fetching user status:", error);
            return NextResponse.json({
                banned: false,
                warningCount: 0
            });
        }

        if (profile?.is_banned) {
            return NextResponse.json({
                banned: true,
                message: "Your account has been banned. If you think this is wrong, please contact our team at ember@gmail.com",
                reason: profile.ban_reason || "Violation of community guidelines"
            });
        }

        return NextResponse.json({
            banned: false,
            warningCount: profile?.warning_count || 0
        });

    } catch (error) {
        console.error("User status check error:", error);
        return NextResponse.json({
            banned: false,
            warningCount: 0
        }, { status: 500 });
    }
}
