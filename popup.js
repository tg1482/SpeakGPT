// Elements

// get a reference to the start and stop buttons
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");

// get a reference to the voice and speed form elements

// listen for the start button click event
startButton.addEventListener("click", () => {
  // get the latest chatgpt response
  getChatGptResponse()
    .then(text => startSpeaking(text))
    .catch(error => console.error(error.message));
});

// Function to retrieve the latest text from the chatGPT response text box
function getChatGptResponse() {
  return new Promise((resolve, reject) => {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {      
      // Send a message to content.js in the active tab
      chrome.tabs.sendMessage(tabs[0].id, { command: 'getChatGptResponse' }, (response) => {
        const textResponse = response.text
        if (typeof textResponse === 'string') {
          resolve(textResponse);
        } else {
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

const getVoice = (synth, voice) => {
  return synth.getVoices().find(v => v.name === voice);
}

async function startSpeaking(text) {
  let voiceSelect = document.getElementById("voice");
  let speedInput = document.getElementById("speed");

  const {utterance, synth} = initSpeechObjects(voiceSelect, speedInput);
  const sentences = splitIntoSentences(text);
  
  let shouldContinue = true;

  console.log(synth.getVoices());

  // add a click event listener to the stop button
  stopButton.addEventListener('click', () => stopSpeaking(synth).then(() => {
    shouldContinue = false;
  }));
  voiceSelect.addEventListener("change", event => {
    console.log("Voice changed", event.target.value);
    new_voice = event.target.value;
    utterance.voice = getVoice(synth, new_voice);
  });
  speedInput.addEventListener("change", event => {
    console.log("Speed changed", event.target.value);
    utterance.rate = event.target.value;;
  });

  for (const sentence of sentences) {
    if (!shouldContinue) {
      console.log('breaking loop now');
      break;
    }

    await speakSentence(sentence, utterance, synth);
  }
};

const initSpeechObjects = (voiceSelect, speedInput) => {
  const voice = voiceSelect.value;
  const speed = speedInput.value;

  const utterance = new SpeechSynthesisUtterance();
  const synth = window.speechSynthesis;

  // set the voice and speed on the utterance
  utterance.voice = getVoice(synth, voice);
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


