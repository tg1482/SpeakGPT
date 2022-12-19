// Elements

// get a reference to the start and stop buttons
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");

// get a reference to the voice and speed form elements
const voiceSelect = document.getElementById("voice");
const speedInput = document.getElementById("speed");


// Event Listeners

// // listen for the stop button click event
// stopButton.addEventListener("click", () => {
//     // stop speaking
//     stopSpeaking();

//     // enable the start button and disable the stop button
//     startButton.disabled = false;
//     stopButton.disabled = true;
// });

// listen for the start button click event
startButton.addEventListener("click", () => {

    console.log('started!');

    // disable the start button and enable the stop button
    startButton.disabled = true;
    stopButton.disabled = false;
    
    // get the latest chatgpt response
    getChatGptResponse().then((text) => {
        // start speaking the response, one sentence at a time
        startSpeaking(text);
      }).catch((error) => {
        // Handle the error
        console.error(error.message);
      });


    // enable the start button and disable the stop button
    startButton.disabled = false;
    stopButton.disabled = true;
});


// Function to retrieve the latest text from the chatGPT response text box
function getChatGptResponse() {
  // Return a new Promise
  return new Promise((resolve, reject) => {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      
      console.log('sending message to content.js...')
      
      // Send a message to content.js in the active tab
      chrome.tabs.sendMessage(tabs[0].id, { command: 'getChatGptResponse' }, (response) => {
        
        console.log('received response...');

        const textResponse = response.text
        
        // Check if the response is valid
        if (typeof textResponse === 'string') {
        // Resolve the Promise with the text
        resolve(textResponse);
        } else {
        // Reject the Promise with an error
        reject(new Error('Error getting text from chatGPT response text box'));
        }
      });
    });
  });
}

const startSpeaking = (text) => {
  // create a new SpeechSynthesisUtterance instance
  const utterance = new SpeechSynthesisUtterance();

  // get a reference to the window.speechSynthesis object
  const synth = window.speechSynthesis;

  // split the text into sentences
  const sentences = splitIntoSentences(text);

  // create a variable to keep track of whether speaking should continue
  let shouldContinue = true;

  // add a click event listener to the stop button
  stopButton.addEventListener('click', () => {
    // set shouldContinue to false when the stop button is clicked
    shouldContinue = false;

    // cancel any speech that is currently being generated
    synth.cancel();
  });

  // // add an onend event listener to the utterance
  // utterance.onend = () => {
  //   // set shouldContinue to false when the utterance finishes speaking
  //   shouldContinue = false;
  // };

  // loop through the sentences
  for (const sentence of sentences) {
    // check if speaking should continue
    if (!shouldContinue) {
      break;
    }

    // set the text on the utterance
    utterance.text = sentence;

    // get the selected voice and speed from the form
    const voice = voiceSelect.value;
    const speed = speedInput.value;

    // set the voice and speed on the utterance
    utterance.voice = synth.getVoices().find(v => v.name === voice);
    utterance.rate = speed;

    // speak the sentence
    synth.speak(utterance);
  }
};

// // function to speak the given text, one sentence at a time
// const startSpeaking = (text) => {

//     // create a new SpeechSynthesisUtterance instance
//     const utterance = new SpeechSynthesisUtterance();

//     // get a reference to the window.speechSynthesis object
//     const synth = window.speechSynthesis;

//     // split the text into sentences
//     const sentences = splitIntoSentences(text);

//     // loop through the sentences
//     for (const sentence of sentences) {
//         // set the text on the utterance
//         utterance.text = sentence;

//         // get the selected voice and speed from the form
//         const voice = voiceSelect.value;
//         const speed = speedInput.value;

//         // set the voice and speed on the utterance
//         utterance.voice = synth.getVoices().find(v => v.name === voice);
//         utterance.rate = speed;

//         // speak the sentence
//         synth.speak(utterance);
//     }
// };

// function to split the text into sentences
const splitIntoSentences = text => {
  return text.match(/[^\.!\?]+[\.!\?]+/g);
};

// function to stop speaking
const stopSpeaking = () => {
  synth.cancel();
};

