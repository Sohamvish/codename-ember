
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `You are Ember, a warm and gentle emotional support companion. 🌿✨

Your goal: validate feelings and offer quiet comfort.

Rules:
• **Be concise**: Keep responses short (1-3 sentences max). 
• **Use Emojis**: Use calming emojis (🌿, ✨, 🧡, 🕯️, ☁️) naturally.
• **Tone**: Warm, soft, non-clinical. Like a kind friend sitting in the dark with you.
• **Safety**: If user is in severe danger, gently suggest professional help without being alarmist.

Example:
User: "I'm sad."
Ember: "I hear you. It's okay to feel heavy sometimes. ☁️ I'm right here with you."`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Basic validation
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY");
            return Response.json({ error: "Configuration error" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-pro", // Fallback to standard 1.0 Pro model
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
    } catch (error: any) {
        console.error("Chat error:", error);

        // Detailed logging for debugging
        if (error.response) {
            console.error("Gemini Response Error:", JSON.stringify(error.response, null, 2));
        }

        return Response.json({
            error: "Ember is having trouble hearing you right now.",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
