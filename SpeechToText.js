export class SpeechToText {
    
    #startButtonElement;
    #outputElement;
    #stopButtonElement;
    #clearButtonElement;
    #copyButtonElement;
    #recognition;
    
    _isListening;
    get isListening() {
        return this._isListening;
    }

    set isListening(value) {
        this._isListening = value;

        this.#startButtonElement.style.display = value ? 'none' : 'block';
        this.#stopButtonElement.style.display = !value ? 'none' : 'block';
    }
    
    #_activeText;
    get activeText() {
        return this.#_activeText;
    }

    set activeText(value) {
        this.#_activeText = value;
        if(this.#activeTextElement) {
            this.#activeTextElement.innerText = value;
        }
    }

    get #activeTextElement() {
        return this.#outputElement.querySelector('.active-text');
    }

    get #outputTextElement() {
        return this.#outputElement.querySelector('.output');
    }

    get outputText() {
        return this.#outputTextElement.innerText;
    }

    /**
     * 
     * @param {{
     *      micElementSelector: string | HTMLElement;
     *      outputElementSelector: string | HTMLElement;
     *      stopElementSelector: string | HTMLElement;
     *      clearElementSelector: string | HTMLElement;
     *      copyElementSelector: string | HTMLElement;
     * }} options 
     */
    constructor({
        micElementSelector,
        outputElementSelector,
        stopElementSelector,
        clearElementSelector,
        copyElementSelector,
    }) {
        this.#startButtonElement = typeof micElementSelector === 'string' ? document.querySelector(micElementSelector) : micElementSelector;
        this.#outputElement = typeof outputElementSelector === 'string' ? document.querySelector(outputElementSelector) : outputElementSelector;
        this.#outputElement.innerHTML = `<span class="output">Hola Amigos</span><span class="active-text"></span>`;
        this.#stopButtonElement = typeof stopElementSelector === 'string' ? document.querySelector(stopElementSelector) : stopElementSelector;
        this.#clearButtonElement = typeof clearElementSelector === 'string' ? document.querySelector(clearElementSelector) : clearElementSelector;
        this.#copyButtonElement = typeof copyElementSelector === 'string' ? document.querySelector(copyElementSelector) : copyElementSelector;

        this.isListening = false;
        this.#addEventListeners();
        this.#enableSpeechRecognition();
    }

    #addEventListeners() {
        this.#startButtonElement.addEventListener('click', this.startRecognition.bind(this));
        this.#stopButtonElement.addEventListener('click', this.stopRecognition.bind(this));
        this.#clearButtonElement.addEventListener('click', this.#clearEverything.bind(this));
        this.#copyButtonElement.addEventListener('click', this.#copyOutput.bind(this));
    }

    #copyOutput() {
        // Copy to clipboard
        navigator.clipboard.writeText(this.outputText);

        this.#showNotification('Copied to clipboard!');
    }

    #showNotification(msg) {
        // Show notification
        const notificationElement = document.createElement('div');
        notificationElement.className = 'alert';
        notificationElement.innerText = msg;
        
        document.body.append(notificationElement);

        setTimeout(() => {
            notificationElement.parentElement.removeChild(notificationElement);
        }, 3000);
    }

    #clearEverything() {
        this.activeText = '';
        this.#outputTextElement.innerHTML = ``;
    }

    #enableSpeechRecognition() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.#recognition = new SpeechRecognition();
        this.#recognition.interimResults = true;
    
        this.#recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
    
            // document.getElementById("p").innerHTML = transcript;
            this.activeText = ' ' + transcript;
            console.log(transcript);
        });
    
        this.#recognition.addEventListener('end', e => {
            // console.log('listening done', e)
            // change back to normal voice icon
            // this.shadowRoot.querySelector('.listening').style.display = 'none';
            // this.shadowRoot.querySelector('.voice').style.display = 'block';
            // this.shadowRoot.querySelector('#searchInput').placeholder = 'Gainsight Finder';
    
            this.#onRecognitionEnd();
        });
    }

    startRecognition() {
        this.isListening = true;
        this.activeText = '';
        this.#recognition.start();
    }

    stopRecognition() {
        this.isListening = false;
        this.#recognition.stop();
    }

    #onRecognitionEnd() {
        this.#updateOutputText();
        this.activeText = '';
        if(this.isListening) {
            this.startRecognition();
        }
    }

    #updateOutputText() {
        const textElement = document.createElement('span');
        textElement.innerText = ' '+this.activeText;

        this.#outputTextElement.append(textElement);
    }
}