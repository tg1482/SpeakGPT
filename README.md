# SpeakGPT
ChatGPT text-to-speech Chrome Extension

### TODO
- Add option to read from selected text
- I should add some tests (at least a folder to put something in)


### Tests based on GPT
Test that the startButton click event listener is correctly registered and that the getChatGptResponse function is called when the startButton is clicked.

Test that the getChatGptResponse function correctly retrieves the text from the chatGPT response text box and resolves the promise with the text.

Test that the stopSpeaking function correctly stops the speech synthesis when it is called.

Test that the startSpeaking function correctly splits the text into sentences and speaks each sentence using the specified voice and speed.

Test that the getVoice function correctly returns the correct voice object based on the specified name.

Test that the initSpeechObjects function correctly initializes the utterance and synth objects with the specified voice and speed.

Test that the speakSentence function correctly speaks the specified sentence and resolves the promise when the speaking is finished.

Test that the splitIntoSentences function correctly splits the text into an array of sentences based on the specified delimiters (periods, exclamation points, and question marks).