
export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return Response.json({ error: "Text is required" }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Fallback to Rachel if missing

        if (!apiKey) {
            return Response.json({ error: "ElevenLabs API Key missing" }, { status: 500 });
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs error:", errorText);
            return Response.json({ error: "Error generating audio", details: errorText }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();

        return new Response(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });

    } catch (error) {
        console.error("Meditation API error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
