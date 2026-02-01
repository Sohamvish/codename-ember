import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { postContent, requesterName } = await req.json();

        const accountUrl = process.env.SNOWFLAKE_ACCOUNT_URL;
        const accessToken = process.env.SNOWFLAKE_ACCESS_TOKEN;

        if (!accountUrl || !accessToken) {
            console.error("Missing Snowflake credentials");
            return NextResponse.json({
                suggestions: [
                    "I saw your post and relate to it. I'd love to talk 1:1 maybe 😊",
                    "Your story resonated with me. Would you be open to connecting?",
                    "I've been through something similar. Let's chat if you're comfortable 💛"
                ]
            });
        }

        // Call Snowflake Cortex AI for personalized invitation
        const response = await fetch(`${accountUrl}/api/v2/cortex/inference:complete`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Snowflake-Authorization-Token-Type": "PROGRAMMATIC_ACCESS_TOKEN"
            },
            body: JSON.stringify({
                model: "mistral-large2",
                messages: [
                    {
                        role: "system",
                        content: "You are a compassionate assistant helping people connect. Generate 3 short, warm, empathetic invitation messages (20-30 words each) for someone who wants to DM another user. Include appropriate emojis. Be genuine, supportive, and respectful. Each message should feel personal and caring."
                    },
                    {
                        role: "user",
                        content: `Generate 3 different invitation messages for someone who wants to connect with the author of this post: "${postContent.substring(0, 200)}". The messages should express empathy and a desire to support or connect.`
                    }
                ],
                options: {
                    temperature: 0.8,
                    max_tokens: 150
                }
            })
        });

        if (!response.ok) {
            console.error("Snowflake API error:", response.status);
            return NextResponse.json({
                suggestions: [
                    "I saw your post and relate to it. I'd love to talk 1:1 maybe 😊",
                    "Your story resonated with me. Would you be open to connecting?",
                    "I've been through something similar. Let's chat if you're comfortable 💛"
                ]
            });
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.messages || data.choices?.[0]?.message?.content || "";

        // Parse AI response into array of suggestions
        const suggestions = aiResponse
            .split('\n')
            .filter((line: string) => line.trim().length > 10)
            .slice(0, 3)
            .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

        // Fallback if parsing fails
        if (suggestions.length === 0) {
            return NextResponse.json({
                suggestions: [
                    "I saw your post and relate to it. I'd love to talk 1:1 maybe 😊",
                    "Your story resonated with me. Would you be open to connecting?",
                    "I've been through something similar. Let's chat if you're comfortable 💛"
                ]
            });
        }

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error("Invitation generation error:", error);
        return NextResponse.json({
            suggestions: [
                "I saw your post and relate to it. I'd love to talk 1:1 maybe 😊",
                "Your story resonated with me. Would you be open to connecting?",
                "I've been through something similar. Let's chat if you're comfortable 💛"
            ]
        });
    }
}
