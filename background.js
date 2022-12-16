// listen for the browser action click event
chrome.browserAction.onClicked.addListener(tab => {
    // send a message to the content script to get the chatgpt response
    chrome.tabs.sendMessage(tab.id, { type: "get-chatgpt-response" }, response => {
      // send a message to the popup script with the chatgpt response
      chrome.runtime.sendMessage({ type: "set-chatgpt-response", response: response.response });
    });
  });
  
  // listen for messages from the popup script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // check if the message is from the popup script
    if (sender.tab) {
      return;
    }
  
    // check if the message is a request to set the chatgpt response
    if (request.type === "set-chatgpt-response") {
      // store the chatgpt response in the background script
      const response = request.response;
    }
  });
  