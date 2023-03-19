export class SpeechToText {
    
    #micButtonElement;
    #outputElement;
    #stopButtonElement;
    #clearButtonElement;
    #copyButtonElement;
    #recognition;
    
    isListening = false;
    
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
        this.#micButtonElement = typeof micElementSelector === 'string' ? document.querySelector(micElementSelector) : micElementSelector;
        this.#outputElement = typeof outputElementSelector === 'string' ? document.querySelector(outputElementSelector) : outputElementSelector;
        this.#outputElement.innerHTML = `<span class="output"></span><span class="active-text"></span>`;
        this.#stopButtonElement = typeof stopElementSelector === 'string' ? document.querySelector(stopElementSelector) : stopElementSelector;
        this.#clearButtonElement = typeof clearElementSelector === 'string' ? document.querySelector(clearElementSelector) : clearElementSelector;
        this.#copyButtonElement = typeof copyElementSelector === 'string' ? document.querySelector(copyElementSelector) : copyElementSelector;

        this.#addEventListeners();
        this.#enableSpeechRecognition();
    }

    #addEventListeners() {
        this.#micButtonElement.addEventListener('click', this.#startRecognition.bind(this));
        this.#stopButtonElement.addEventListener('click', this.#stopRecognition.bind(this));
        this.#clearButtonElement.addEventListener('click', this.#clearEverything.bind(this));
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

    #startRecognition() {
        this.isListening = true;
        this.activeText = '';
        this.#recognition.start();
    }

    #stopRecognition() {
        this.isListening = false;
        this.#recognition.stop();
    }

    #onRecognitionEnd() {
        this.#updateOutputText();
        this.activeText = '';
        if(this.isListening) {
            this.#startRecognition();
        }
    }

    #updateOutputText() {
        const textElement = document.createElement('span');
        textElement.innerText = ' '+this.activeText;

        this.#outputTextElement.append(textElement);
    }
}