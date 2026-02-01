// Generate meditation scripts using Snowflake Cortex AI
export async function POST(req: Request) {
    try {
        const accountUrl = process.env.SNOWFLAKE_ACCOUNT_URL;
        const accessToken = process.env.SNOWFLAKE_ACCESS_TOKEN;

        if (!accountUrl || !accessToken) {
            console.error("Missing Snowflake credentials");
            // Fallback to pre-written script if Snowflake not configured
            const fallbackScripts = [
                "Find a comfortable space and settle in close to the warmth. Watch the flames dance and flicker before you. Breathe in slowly, feeling the gentle heat on your face. As you exhale, listen to the soft crackle and pop of the fire. You are safe here, held by the glow of the embers.",
                "Close your eyes and imagine sitting by a bonfire under the stars. Feel the warmth radiating from the flames. Breathe in the smoky, earthy scent. As you exhale, hear the wood crackle and spark. Each breath is like a flame—rising, glowing, constant and sure. You are held by this warmth.",
            ];
            return Response.json({
                script: fallbackScripts[Math.floor(Math.random() * fallbackScripts.length)]
            });
        }

        // Call Snowflake Cortex AI to generate meditation script
        const response = await fetch(`${accountUrl}/api/v2/cortex/inference:complete`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Snowflake-Authorization-Token-Type": "PROGRAMMATIC_ACCESS_TOKEN"
            },
            body: JSON.stringify({
                model: "mistral-large2", // Good for creative writing
                messages: [
                    {
                        role: "system",
                        content: "You are a meditation guide. Generate a detailed, slow-paced 5-minute guided meditation with flickering fire and bonfire imagery. Use very gentle, soothing language. Include long pauses between sentences. Focus on the warmth of the fire, crackling sounds, and the peaceful glow of flames. Make it deeply calming and slow."
                    },
                    {
                        role: "user",
                        content: "Create a 5-minute guided meditation script focused on sitting by a warm bonfire, watching the flames flicker, and listening to the crackling sounds. Make it very slow and detailed with breathing instructions."
                    }
                ],
                options: {
                    temperature: 0.8,
                    max_tokens: 800
                }
            })
        });

        if (!response.ok) {
            console.error("Snowflake API error:", response.status, await response.text());
            // Fallback
            return Response.json({
                script: "Find a comfortable space and let your shoulders soften. Breathe in slowly, like the gentle rise of ocean waves. You are safe here, floating peacefully on the rhythm of the sea."
            });
        }

        const data = await response.json();
        const script = data.choices?.[0]?.messages || data.choices?.[0]?.message?.content || "Breathe deeply and find your calm. 🌊";

        return Response.json({ script: script.trim() });

    } catch (error) {
        console.error("Meditation script generation error:", error);
        return Response.json({
            script: "Find a comfortable space. Breathe in slowly. You are safe here. 🌊"
        }, { status: 500 });
    }
}
