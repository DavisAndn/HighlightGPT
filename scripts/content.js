let popup = null;
let selectedText = '';
let extensionEnabled = false;

// Function to show the popup
function showPopup(rect, text) {
  if (!popup) {
    popup = document.createElement('div');
    popup.className = 'highlight-popup';
    document.body.appendChild(popup);
  }
  popup.textContent = text;
  popup.style.left = `${rect.left}px`;
  popup.style.top = `${rect.bottom}px`;
  popup.style.display = 'block';
}

// Function to hide the popup
function hidePopup() {
  if (popup) {
    popup.style.display = 'none';
  }
}

let currentSource = 'text'; // Default to 'text'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'sourceChanged') {
    currentSource = request.source;
  } else if (request.type === 'extensionEnabled') {
    extensionEnabled = request.extensionEnabled;
  }
});

// Always listen for mouseup events, but only act on them if the extension is enabled
document.addEventListener('mouseup', function(event) {
  if (extensionEnabled) {
    console.log("extension enabled")
    selectedText = window.getSelection().toString().trim();
    console.log(`Length of selected text: ${selectedText.length}`);

    if (selectedText.length > 0) {
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (true) { //if currentSource === 'gpt'
        fetchGptResponse(selectedText, function(response) {
          showPopup(rect, response);
        });
      } else if (currentSource === 'text') {
        showPopup(rect, selectedText);
      }

      document.addEventListener('mousedown', function onMouseDown() {
        hidePopup();
        selectedText = '';
      }, { once: true });
    } else {
      hidePopup();
    }
  }
});

// Listen for state changes from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  extensionEnabled = request.extensionEnabled;
});

// Load the initial state from storage
chrome.storage.sync.get('extensionEnabled', function(data) {
  extensionEnabled = data.extensionEnabled;
});


function fetchGptResponse(text, callback) {
  chrome.storage.local.get('gptKey', (result) => {
    const gptKey = result.gptKey;
    alert(`GPT key fetched: ${gptKey}`);
    if (!gptKey) {
      console.error('GPT key is not set.');
      callback('GPT key is not set.');
      return;
    }

    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${gptKey}`
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: text}],
      max_tokens: 150
    });

    fetch(url, { method: "POST", headers: headers, body: body })
      .then(response => response.json())
      .then(data => {
        if (data.choices && data.choices.length > 0) {
          callback(data.choices[0].message.content);
        } else {
          callback("No response from GPT.");
        }
      })
      .catch(error => {
        console.error('Error fetching GPT response:', error);
        callback("Error fetching response.");
      });
  });
}