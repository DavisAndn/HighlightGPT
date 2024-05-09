const axios = require('axios');
require('dotenv').config();

function fetchGptResponse(text, callback) {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GPT_API_KEY}`
    };
    const body = {
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: text}],
        max_tokens: 150
    };

    axios.post(url, body, { headers: headers })
        .then(response => {
            if (response.data.choices && response.data.choices.length > 0) {
                callback(null, response.data.choices[0].message.content);
            } else {
                callback("No response from GPT.");
            }
        })
        .catch(error => {
            console.error('Error fetching GPT response:', error);
            callback(error);
        });
}

// Example test call
fetchGptResponse("Set Up Environment Variables", (error, response) => {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Response:", response);
    }
});
