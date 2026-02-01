import { NextRequest, NextResponse } from "next/server";

// Snowflake Cortex AI for text completion
export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        const accountUrl = process.env.SNOWFLAKE_ACCOUNT_URL;
        const accessToken = process.env.SNOWFLAKE_ACCESS_TOKEN;

        if (!accountUrl || !accessToken) {
            console.error("Missing Snowflake credentials");
            return NextResponse.json({
                suggestion: ""
            });
        }

        // Call Snowflake Cortex AI for text completion
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
                        content: "You are a helpful writing assistant. Complete the user's sentence in a natural, empathetic way. Keep completions short (5-10 words max). Match the tone and style of the input."
                    },
                    {
                        role: "user",
                        content: `Complete this sentence naturally: "${text}"`
                    }
                ],
                options: {
                    temperature: 0.7,
                    max_tokens: 30
                }
            })
        });

        if (!response.ok) {
            console.error("Snowflake API error:", response.status);
            return NextResponse.json({ suggestion: "" });
        }

        const data = await response.json();
        const suggestion = data.choices?.[0]?.messages || data.choices?.[0]?.message?.content || "";

        return NextResponse.json({ suggestion: suggestion.trim() });

    } catch (error) {
        console.error("Auto-complete error:", error);
        return NextResponse.json({ suggestion: "" });
    }
}
