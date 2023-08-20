export class SpeechToText {
    
    #micButtonElement;
    #outputElement;
    #clearButtonElement;
    #copyButtonElement;
    #speechRecognition;

    _isListening;
    get isListening() {
        return this._isListening;
    }

    set isListening(value) {
        this._isListening = value;

        if (value) {
            this.#micButtonElement.classList.add('listening');
        } else {
            this.#micButtonElement.classList.remove('listening');
        }
    }
    
    #_activeText;
    get activeText() {
        return this.#_activeText;
    }

    set activeText(value) {
        this.#_activeText = value;
        this.#activeTextElement.innerText = value;
    }

    #activeTextElement;
    #outputTextElement;

    #_outputText = '';
    get outputText() {
        return this.#_outputText;
    }
    
    set outputText(value) {
        this.#_outputText = value;
        this.#outputTextElement.innerHTML = value;
    }

    /**
     * 
     * @param {{
     *      micElementSelector: string;
     *      outputElementSelector: string;
     *      clearElementSelector: string;
     *      copyElementSelector: string;
     * }} options 
     */
    constructor(options) {
        // if(!micElementSelector) {
        //     console.error('Please pass the selector: "micElementSelector"');
        //     return;
        // }
        if (this.#optionsNullCheck(options)) {
            console.error('Closing app...');
            return;
        }

        const {
            micElementSelector,
            outputElementSelector,
            clearElementSelector,
            copyElementSelector,
        } = options;

        this.#micButtonElement = document.querySelector(micElementSelector);
        this.#outputElement = document.querySelector(outputElementSelector);
        this.#clearButtonElement = document.querySelector(clearElementSelector);
        this.#copyButtonElement = document.querySelector(copyElementSelector);

        this.#outputElement.innerHTML = `<span class="output"></span><span class="active-text"></span>`;
        
        this.#activeTextElement = this.#outputElement.querySelector('.active-text');
        this.#outputTextElement = this.#outputElement.querySelector('.output');
        
        this.isListening = false;
        this.#addEventListeners();
        this.#enableSpeechRecognition();
    }

    #extractTranscript(event) {
        return event.results[0][0].transcript;
    }

    #enableSpeechRecognition() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        // Step-1: Create instance
        this.#speechRecognition = new SpeechRecognition();
        this.#speechRecognition.interimResults = true;
        
        // Step-2: add 'result' listener
        this.#speechRecognition.addEventListener('result', event => {
            console.log(event.results);
            const transcript = this.#extractTranscript(event);
            // console.log('Output: ', transcript);
            this.activeText = ' ' + transcript;
        });

        // this.#speechRecognition.start();
        this.#speechRecognition.addEventListener('end', this.#onRecognitionEnd.bind(this));
    }

    #onRecognitionEnd() {
        this.#updateOutputText();
        if (this.isListening) {
            this.startRecognition();
        }
    }

    /**
     * Add the activeText to the final output
     */
    #updateOutputText() {
        if (!this.activeText) {
            return;
        }

        this.outputText += ' ' + this.activeText;

        this.activeText = '';
    }

    #optionsNullCheck(options) {
        const nullSelectors = [
            'micElementSelector',
            'outputElementSelector',
            'clearElementSelector',
            'copyElementSelector'
        ].filter(selector => !options[selector]);

        if (nullSelectors.length) {
            console.error(`Please provide the following selectors: ${nullSelectors.join(', ')}`);
            return true;
        }

        return false;
    }

    #addEventListeners() {
        this.#micButtonElement.addEventListener('click', this.toggleListen.bind(this));
        this.#clearButtonElement.addEventListener('click', this.#clearEverything.bind(this));
        this.#copyButtonElement.addEventListener('click', this.#copyOutput.bind(this));
    }

    toggleListen() {
        if (this.isListening) {
            this.stopRecognition();
        } else {
            this.startRecognition();
        }
    }

    startRecognition() {
        this.isListening = true;
        this.#speechRecognition.start();
    }

    stopRecognition() {
        this.isListening = false;
        this.#speechRecognition.stop();
    }

    #clearEverything() {
        this.activeText = '';
        this.outputText = '';
    }
    
    #copyOutput() {
        navigator.clipboard.writeText(this.outputText);
        this.#showNotification('Copied to clipboard!');
    }

    #showNotification(msg) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'alert';
        notificationElement.innerText = msg;

        document.body.append(notificationElement);

        setTimeout(() => {
            notificationElement.parentElement.removeChild(notificationElement);
        }, 3000);
    }
}