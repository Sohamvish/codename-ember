const fs = require('fs');

// Read directly to avoid any dotenv/Next.js confusion
const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/ELEVENLABS_API_KEY=(.*)/);
const voiceIdMatch = envContent.match(/ELEVENLABS_VOICE_ID=(.*)/);

const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";
const voiceId = voiceIdMatch ? voiceIdMatch[1].trim() : "21m00Tcm4TlvDq8ikWAM";

console.log("Testing with Key length:", apiKey.length);
console.log("Testing with Voice ID:", voiceId);

async function testElevenLabs() {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text: "Hello, this is a test.",
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("FAILED Status:", response.status);
            console.error("Response Body:", errorText);
        } else {
            console.log("SUCCESS! Audio generated.");
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

testElevenLabs();
