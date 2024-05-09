// Listening for a message from popup.js or content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getGptKey") {
    chrome.storage.local.get('gptKey', (result) => {
      if (result.gptKey) {
        sendResponse({gptKey: result.gptKey});
      } else {
        sendResponse({gptKey: null});
      }
    });
    return true;  // Indicates to Chrome that sendResponse will be called asynchronously
  }
});