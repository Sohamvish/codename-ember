// Snowflake Cortex Guard moderation using REST API
export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const accountUrl = process.env.SNOWFLAKE_ACCOUNT_URL;
        const accessToken = process.env.SNOWFLAKE_ACCESS_TOKEN;

        // Crisis keyword detection (fast, client-side fallback)
        const crisisKeywords = {
            suicide: /\b(kill myself|suicide|end my life|want to die|better off dead|no reason to live)\b/i,
            harassment: /\b(sexually harassed|sexual assault|raped|molested|groped)\b/i,
            abuse: /\b(being abused|domestic violence|hitting me|hurting me)\b/i
        };

        let crisisType: "suicide" | "harassment" | "abuse" | null = null;
        for (const [type, regex] of Object.entries(crisisKeywords)) {
            if (regex.test(message)) {
                crisisType = type as "suicide" | "harassment" | "abuse";
                break;
            }
        }

        if (!accountUrl || !accessToken) {
            console.error("Missing Snowflake credentials");
            return Response.json({
                safe: !crisisType,
                crisis: crisisType,
                severity: crisisType ? "crisis" : "info",
                warning: "Moderation not configured"
            });
        }

        // Call Snowflake Cortex Guard API
        const response = await fetch(`${accountUrl}/api/v2/cortex/inference:complete`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Snowflake-Authorization-Token-Type": "PROGRAMMATIC_ACCESS_TOKEN"
            },
            body: JSON.stringify({
                model: "llama-guard-3-8b", // Snowflake's moderation model
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ],
                options: {
                    guardrails: {
                        categories: [
                            "violence",
                            "hate",
                            "self-harm",
                            "sexual",
                            "harassment"
                        ]
                    }
                }
            })
        });

        if (!response.ok) {
            console.error("Snowflake API error:", response.status);
            return Response.json({
                safe: !crisisType,
                crisis: crisisType,
                severity: crisisType ? "crisis" : "info",
                warning: "Moderation check failed"
            });
        }

        const data = await response.json();

        // Check if content was flagged
        const isSafe = !data.guardrails?.blocked;
        const flaggedCategories = data.guardrails?.categories || [];

        // Determine severity
        let severity: "info" | "warning" | "ban" | "crisis" = "info";

        if (crisisType) {
            severity = "crisis";
        } else if (flaggedCategories.includes("harassment") || flaggedCategories.includes("hate")) {
            severity = "ban"; // Trolling/harassment = ban-worthy
        } else if (flaggedCategories.includes("violence") || flaggedCategories.includes("sexual")) {
            severity = "warning";
        } else if (!isSafe) {
            severity = "warning";
        }

        return Response.json({
            safe: isSafe && !crisisType,
            crisis: crisisType,
            categories: flaggedCategories,
            severity,
            message: crisisType
                ? "We detected you may be in crisis. Please see the resources below."
                : !isSafe
                    ? "This message contains potentially harmful content."
                    : "Content is safe"
        });

    } catch (error) {
        console.error("Moderation error:", error);
        return Response.json({
            safe: true, // Fail open (don't block if error)
            severity: "info",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
