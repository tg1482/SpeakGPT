// get a reference to the start and stop buttons
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");

// get a reference to the voice and speed form elements
const voiceSelect = document.getElementById("voice");
const speedInput = document.getElementById("speed");

// create a new SpeechSynthesisUtterance instance
const utterance = new SpeechSynthesisUtterance();

// get a reference to the window.speechSynthesis object
const synth = window.speechSynthesis;

// function to split the text into sentences
const splitIntoSentences = text => {
  return text.match(/[^\.!\?]+[\.!\?]+/g);
};

// function to speak the given text, one sentence at a time
const speak = text => {
  // split the text into sentences
  const sentences = splitIntoSentences(text);

  // loop through the sentences
  for (const sentence of sentences) {
    // set the text on the utterance
    utterance.text = sentence;

    // get the selected voice and speed from the form
    const voice = voiceSelect.value;
    const speed = speedInput.value;

    // set the voice and speed on the utterance
    utterance.voice = synth.getVoices().find(v => v.name === voice);
    utterance.rate = speed;

    // listen for the onboundary event to highlight the current sentence
    synth.onboundary = e => {
      // create a new span element for the current sentence
      const span = document.createElement("span");
      span.textContent = e.characters;
      span.classList.add("highlight");
      document.body.appendChild(span);
    };

    // speak the sentence
    synth.speak(utterance);
  }
};

// function to stop speaking
const stop = () => {
  synth.cancel();
};

// listen for the start button click event
startButton.addEventListener("click", () => {

  console.log('started!');
  // get the latest chatgpt response
  const response = getChatGptResponse();

  // start speaking the response, one sentence at a time
  speak(response);

  // disable the start button and enable the stop button
  startButton.disabled = true;
  stopButton.disabled = false;
});

// listen for the stop button click event
stopButton.addEventListener("click", () => {
  // stop speaking
  stop();

  // enable the start button and disable the stop button
  startButton.disabled = false;
  stopButton.disabled = true;
});
