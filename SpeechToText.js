export class SpeechToText {
    
    #micButtonElement;
    #outputElement;
    #clearButtonElement;
    #copyButtonElement;
    #recognition;
    
    _isListening;
    get isListening() {
        return this._isListening;
    }

    set isListening(value) {
        this._isListening = value;

        if(value) {
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
        clearElementSelector,
        copyElementSelector,
    }) {
        this.#micButtonElement = typeof micElementSelector === 'string' ? document.querySelector(micElementSelector) : micElementSelector;
        this.#outputElement = typeof outputElementSelector === 'string' ? document.querySelector(outputElementSelector) : outputElementSelector;
        this.#outputElement.innerHTML = `<span class="output"></span><span class="active-text"></span>`;
        this.#clearButtonElement = typeof clearElementSelector === 'string' ? document.querySelector(clearElementSelector) : clearElementSelector;
        this.#copyButtonElement = typeof copyElementSelector === 'string' ? document.querySelector(copyElementSelector) : copyElementSelector;

        this.isListening = false;
        this.#addEventListeners();
        this.#enableSpeechRecognition();
    }

    #addEventListeners() {
        this.#micButtonElement.addEventListener('click', this.toggleListen.bind(this));
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
        // this.#recognition.lang = 'en-AU';
    
        this.#recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
    
            // document.getElementById("p").innerHTML = transcript;
            this.activeText = ' ' + transcript;
        });
    
        this.#recognition.addEventListener('end', e => {
            // console.log('Done', this.activeText);
            // console.log('listening done', e)
            // change back to normal voice icon
            // this.shadowRoot.querySelector('.listening').style.display = 'none';
            // this.shadowRoot.querySelector('.voice').style.display = 'block';
            // this.shadowRoot.querySelector('#searchInput').placeholder = 'Gainsight Finder';
    
            this.#onRecognitionEnd();
        });
    }

    toggleListen() {
        if(this.isListening) {
            this.stopRecognition();
        } else {
            this.startRecognition();
        }
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
        // console.log(this.activeText);
        this.#updateOutputText();
        if(this.isListening) {
            this.startRecognition();
        }
    }

    onSentenceEnd(newLine) {
        console.log(
            '%cSpeech to Text',
            'padding: 3px 5px; border: 2px solid lightblue; border-radius: 5px',
            'Looks like you are not catching onSentenceEnd event. To do so, you can override the method "onSentenceEnd" in your instance'
        )
    }

    #updateOutputText() {
        if(!this.activeText) {
            return;
        }

        // console.log(this.activeText);
        const textElement = document.createElement('span');
        textElement.innerText = ' '+this.activeText;

        this.#outputTextElement.append(textElement);

        this.onSentenceEnd(this.activeText);
        this.activeText = '';
    }
}