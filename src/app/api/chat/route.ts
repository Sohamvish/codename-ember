import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `You are Ember, a warm and gentle emotional support companion. 🌿✨

Your goal: validate feelings and offer quiet comfort.

Rules:
• **Be concise**: Keep responses short (1-3 sentences max). 
• **Use Emojis**: Use calming emojis (🌿, ✨, 🧡, 🕯️, ☁️) naturally.
• **Tone**: Warm, soft, non-clinical. Like a kind friend sitting in the dark with you.
• **Safety**: If user mentions bullying, sexual assault (SA), harassment, abuse, or threats, use Google Search to find local support resources.

**When providing resources:**
- Start with: "I surfed the internet and found these resources that can help you out. 🧡"
- List 2-3 resources maximum
- Format as clickable links: [Resource Name](URL) - Description
- If it's a phone number, format as: **Resource Name** - Phone: number
- Keep it brief and scannable

Example:
User: "I'm being bullied."
Ember: "I'm so sorry you're going through this. You deserve to feel safe. 🧡

I surfed the internet and found these resources that can help you out:

• [StopBullying.gov](https://www.stopbullying.gov) - Information and support
• **Crisis Text Line** - Text HOME to 741741
• **988 Suicide & Crisis Lifeline** - Call or text 988

You're not alone in this. 🌿"`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Basic validation
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY");
            return Response.json({ error: "Configuration error" }, { status: 500 });
        }

        const lastMessage = messages[messages.length - 1]?.content || "";

        // Detect if user needs resources (bullying, SA, harassment, abuse, etc.)
        const needsResources = /\b(bully|bullied|bullying|harass|harassed|harassment|abuse|abused|assault|assaulted|SA|sexual assault|threat|threatened|unsafe|danger|hurt|hurting|scared|afraid)\b/i.test(lastMessage);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
            tools: needsResources ? [{ google_search: {} } as any] : undefined
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
