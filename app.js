import { SpeechToText } from "./SpeechToText.js";
const speechToText = new SpeechToText({
    micElementSelector: '.mic-btn',
    outputElementSelector: '.text',
    clearElementSelector: '.clear-everything',
    copyElementSelector: '.copy-text'
});