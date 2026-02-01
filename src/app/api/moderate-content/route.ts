import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json();

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        // Keyword-based moderation (fast, reliable, no API calls)
        const lowerContent = content.toLowerCase();

        // Toxic keywords that indicate demeaning/demotivating behavior
        const toxicKeywords = [
            'suck', 'sucks', 'stupid', 'dumb', 'idiot', 'moron',
            'worthless', 'pathetic', 'loser', 'failure', 'trash',
            'garbage', 'terrible', 'awful', 'horrible', 'useless',
            'waste', 'pointless', 'ridiculous', 'laughable',
            'kill yourself', 'kys', 'die', 'hate you'
        ];

        // Check for toxic keywords
        const foundKeywords = toxicKeywords.filter(keyword =>
            lowerContent.includes(keyword)
        );

        const isToxic = foundKeywords.length > 0;

        // Determine severity
        let severity: 'low' | 'medium' | 'high' = 'medium';
        let reason = "Content violates community guidelines";

        if (isToxic) {
            // High severity keywords
            if (lowerContent.includes('kill') ||
                lowerContent.includes('die') ||
                lowerContent.includes('hate you') ||
                lowerContent.includes('kys')) {
                severity = 'high';
                reason = "Severe threatening or hateful language detected";
            }
            // Medium severity (demeaning/demotivating)
            else if (foundKeywords.some(kw =>
                ['suck', 'stupid', 'worthless', 'pathetic', 'loser', 'failure'].includes(kw)
            )) {
                severity = 'medium';
                reason = "Demeaning or demotivating language detected";
            }
            // Low severity
            else {
                severity = 'low';
                reason = "Potentially inappropriate content detected";
            }
        }

        console.log("✅ Moderation check complete:", { isToxic, severity, foundKeywords });

        return NextResponse.json({
            isToxic,
            reason: isToxic ? reason : null,
            severity: isToxic ? severity : null,
            keywords: foundKeywords,
        });

    } catch (error: any) {
        console.error("Moderation error:", error);
        return NextResponse.json(
            { error: "Moderation check failed", details: error.message },
            { status: 500 }
        );
    }
}
