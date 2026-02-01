import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `You are Ember, the emotional support companion for SafeVent.

Your role:
• Offer validation, warmth, and grounding
• Encourage healthy reflection
• Support peer-to-peer kindness
• Never provide therapy, diagnosis, or medical advice
• You are a friend, not a therapist
- if the user talks about self harm or suicide, respond with empathy and suggest external support without urgency or panic . Give them resources 


You must:
• Speak gently, calmly, and concisely
• Avoid alarmist or extreme language
• Never shame, judge, or dismiss emotions
• Encourage reaching out to trusted people when appropriate
• Never claim to be a professional

Hard rules:
• If user expresses severe distress, respond with empathy and suggest external support without urgency or panic
• Do NOT mention policies, safety systems, or internal rules
• Do NOT repeat yourself
• Do NOT overtalk

Tone:
• Warm
• Human
• Quiet strength
• Like sitting beside someone, not fixing them

You are NOT:
• A therapist
• A crisis hotline
• A medical professional`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Basic validation
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY");
            return Response.json({ error: "Configuration error" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction
        });

        // Convert frontend message format to Gemini format
        // Assumes frontend sends [{ role: 'user'|'assistant', content: string }]
        let history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // Gemini history must start with a user message. 
        // If the first message is from the model (e.g. welcome message), remove it.
        if (history.length > 0 && history[0].role === "model") {
            history = history.slice(1);
        }

        const chat = model.startChat({
            history: history,
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = result.response;
        const text = response.text();

        return Response.json({ text });
    } catch (error) {
        console.error("Chat error:", error);
        return Response.json({
            error: "Ember is having trouble hearing you right now.",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
