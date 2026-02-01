const apiKey = "AIzaSyDKK8Y_XpiILQfRQwqDmRkVtDuZYKBIXDo";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function fetchModels() {
    try {
        console.log("Fetching models...");
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            console.error(text);
        } else {
            const data = await response.json();
            console.log("Models:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

fetchModels();
