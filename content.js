console.log('I am loaded...')

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is a getChatGptResponse message
    if (request.command === 'getChatGptResponse') {

        console.log('start looking for response');

        // Select the most recent response
        const response = findChatGptResponse()
    
        // Check if the response exists
        if (response) {
            // Send the response text to popup.js
            sendResponse({ text: response });
        } else {
            // Send an error to popup.js
            sendResponse({ error: 'Error sending text from chatGPT response text box' });
        }
    }
});
  
// function to find the latest chatgpt response on the page
const findChatGptResponse = () => {
    const elements = document.querySelectorAll('[class*="444654"]');

    console.log(elements);

    last_response = elements[elements.length - 1].textContent

    console.log(last_response);

    return last_response
};
