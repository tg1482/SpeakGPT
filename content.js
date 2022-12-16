// listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // check if the message is from the background script
    if (sender.tab) {
      return;
    }
  
    // check if the message is a request to get the latest chatgpt response
    if (request.type === "get-chatgpt-response") {
      // find the chatgpt response on the page
      const response = findChatGptResponse();
  
      // send the response back to the background script
      sendResponse({ response });
    }
  });
  
  // function to find the latest chatgpt response on the page
  const findChatGptResponse = () => {
    // your code to find the chatgpt response on the page
    // you can use DOM manipulation and traversal techniques such as querySelector()
    // and getElementsByTagName() to find the chatgpt response element
    // and then use its textContent property to get the response text
    // you may need to adjust this function depending on the structure and layout of your page
    const responseElement = document.querySelector(".chatgpt-response");
    return responseElement ? responseElement.textContent : "";
  };
  