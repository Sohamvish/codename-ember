const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
const keyMatch = content.match(/GEMINI_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : "";

async function listModels() {
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels method on the client instance in some versions,
        // but usually it's separate. Let's try to just run a simple prompt on gemini-pro to see if THAT works.

        // Actually, let's just try to generate content with 'gemini-pro' as a fallback test.
        const proModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await proModel.generateContent("Test");
        console.log("gemini-pro works!");
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await flashModel.generateContent("Test");
        console.log("gemini-1.5-flash works!");
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }
}

listModels();
