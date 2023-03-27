import { SpeechToText } from "./SpeechToText.js";

new SpeechToText({
    micElementSelector: '.mic-btn',
    outputElementSelector: '.text',
    clearElementSelector: '.clear-everything',
    copyElementSelector: '.copy-text'
});