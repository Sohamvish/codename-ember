// Snowflake Cortex Guard moderation using REST API
export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const accountUrl = process.env.SNOWFLAKE_ACCOUNT_URL;
        const accessToken = process.env.SNOWFLAKE_ACCESS_TOKEN;

        if (!accountUrl || !accessToken) {
            console.error("Missing Snowflake credentials");
            return Response.json({
                safe: true, // Fail open (allow message if Snowflake not configured)
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
                safe: true, // Fail open
                warning: "Moderation check failed"
            });
        }

        const data = await response.json();

        // Check if content was flagged
        const isSafe = !data.guardrails?.blocked;
        const flaggedCategories = data.guardrails?.categories || [];

        return Response.json({
            safe: isSafe,
            categories: flaggedCategories,
            message: isSafe
                ? "Content is safe"
                : "This message contains potentially harmful content. If you're in crisis, please reach out to a crisis helpline. 🧡"
        });

    } catch (error) {
        console.error("Moderation error:", error);
        return Response.json({
            safe: true, // Fail open (don't block if error)
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
