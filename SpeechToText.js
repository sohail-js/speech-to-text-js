export class SpeechToText {
    
    #micButtonElement;
    #outputElement;
    #stopButtonElement;
    #clearButtonElement;
    #copyButtonElement;
    #recognition;
    #_activeText;
    
    get activeText() {
        return this.#_activeText;
    }

    set activeText(value) {
        this.#_activeText = value;
        if(this.activeTextElement) {
            this.activeTextElement.innerText = value;
        }
    }

    get activeTextElement() {
        return this.#outputElement.querySelector('.active-text');
    }

    /**
     * 
     * @param {{
     *      micElementSelector: string | HTMLElement;
     *      outputElementSelector: string | HTMLElement;
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
        this.#stopButtonElement = typeof stopElementSelector === 'string' ? document.querySelector(stopElementSelector) : stopElementSelector;
        this.#clearButtonElement = typeof clearElementSelector === 'string' ? document.querySelector(clearElementSelector) : clearElementSelector;
        this.#copyButtonElement = typeof copyElementSelector === 'string' ? document.querySelector(copyElementSelector) : copyElementSelector;

        this.#enableSpeechRecognition();
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
        
        this.#micButtonElement.addEventListener('click', event => {
            console.log('listening...');
            this.#startRecognition();
        })
    }

    #startRecognition() {
        this.activeText = '';
        this.#recognition.start();
    }

    #onRecognitionEnd() {
        this.#updateOutputText();

        this.#startRecognition();
    }

    #updateOutputText() {
        const textElement = document.createElement('span');
        textElement.innerText = ' '+this.activeText;

        this.#outputElement.insertBefore(textElement, this.activeTextElement)
    }
}