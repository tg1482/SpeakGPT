// Elements

// get a reference to the start and stop buttons
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");

// get a reference to the voice and speed form elements
let voiceSelect = document.getElementById("voice");
let speedInput = document.getElementById("speed");

// listen for the start button click event
startButton.addEventListener("click", () => {
  // get the latest chatgpt response
  getChatGptResponse()
    .then(text => startSpeaking(text))
    .catch(error => console.error(error.message));

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
};

// function to stop speaking
const stopSpeaking = synth => {
  return new Promise((resolve, reject) => {
    synth.cancel();
    resolve();
  });
};


async function startSpeaking(text) {

  const {utterance, synth} = initSpeechObjects();
  const sentences = splitIntoSentences(text);
  let shouldContinue = true;

  // add a click event listener to the stop button
  stopButton.addEventListener('click', () => stopSpeaking(synth).then(() => {
    shouldContinue = false;
  }));

  for (const sentence of sentences) {
    console.log(`shouldContinue: ${shouldContinue}`);
    if (!shouldContinue) {
      console.log('breaking loop now');
      break;
    }

    await speakSentence(sentence, utterance, synth);
  }
};

const initSpeechObjects = () => {
  // get the selected voice and speed from the form
  let voice = voiceSelect.value;
  let speed = speedInput.value;

  // create a new SpeechSynthesisUtterance instance
  const utterance = new SpeechSynthesisUtterance();
  const synth = window.speechSynthesis;

  // set the voice and speed on the utterance
  utterance.voice = synth.getVoices().find(v => v.name === voice);
  utterance.rate = speed;
  
  return {utterance, synth}
};

const speakSentence = (sentence, utterance, synth) => {
  return new Promise((resolve, reject) => {
    // set the text on the utterance
    utterance.text = sentence;
    console.log(`speaking sentence ${sentence}`);
    // speak the sentence
    synth.speak(utterance);
    // resolve the promise when the speaking is finished
    utterance.onend = () => resolve();
  });
}

// function to split the text into sentences
const splitIntoSentences = text => {
  return text.match(/[^\.!\?]+[\.!\?]+/g);
};


