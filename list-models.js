const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

// Get API key from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : "";

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // Hack to check auth? 
        // Actually there isn't a direct listModels on the client instance in some versions?
        // Using default fetch if SDK doesn't expose it easily, or just try a standard model.
        console.log("Checking known models...");

        const candidates = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-pro"];

        for (const modelName of candidates) {
            process.stdout.write(`Testing ${modelName}: `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log("OK ✅");
            } catch (e) {
                console.log(`FAILED ❌`);
                console.error(e);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
