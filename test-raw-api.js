const https = require('https');

const apiKey = "AIzaSyDKK8Y_XpiILQfRQwqDmRkVtDuZYKBIXDo"; // Using the key directly to test
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Fetching from:", url.replace(apiKey, "HIDDEN_KEY"));

https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else {
                console.log("Success! Models found:", json.models ? json.models.length : 0);
                if (json.models) {
                    console.log("Top 3:", json.models.slice(0, 3).map(m => m.name));
                }
            }
        } catch (e) {
            console.log("Raw Body:", data);
        }
    });

}).on('error', (err) => {
    console.error('Network Error:', err.message);
});
