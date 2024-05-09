function verifyGoogleAPIKey(key, callback) {
  const query = 'test';
  const cx = '017127030588722237122:ttrznd5axgy' //search engine id frm https://programmablesearchengine.google.com/controlpanel/
  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${key}&cx=${cx}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        callback(false, data.error.message);
      } else {
        callback(true);
      }
    })
    .catch(error => {
      callback(false, error.message);
    });
}

function verifyGptAPIKey(key, callback) {
  // Define the API endpoint and parameters for the Chat API
  const url = "https://api.openai.com/v1/chat/completions";
  const messages = [{role: "system", content: "Start"}];  // Simple system message to initiate the conversation
  const model = "gpt-3.5-turbo";

  // Prepare the request headers and body
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  };
  const body = JSON.stringify({
    model: model,
    messages: messages,
    max_tokens: 5
  });

  // Make the API request
  fetch(url, {
    method: "POST",
    headers: headers,
    body: body
  })
  .then(response => response.json().then(data => {
    if (response.ok) {
      // If the response is OK, the key is valid
      console.log("API key verification successful!");
      callback(true, null);
    } else {
      // If the response is not OK, extract the error message from data
      console.log("API key verification unsuccessful!");
      callback(false, data.error.message);
    }
  }))
  .catch(error => {
    // If there's a network error, handle it
    callback(false, error.message);
  });
}
