import { SpeechToText } from "./SpeechToText.js";

new SpeechToText({
    micElementSelector: '.start-listening',
    outputElementSelector: '.text',
    stopElementSelector: '.stop-listening',
});