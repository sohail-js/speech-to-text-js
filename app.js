// 11:20PM - 11:35 PM

function enableSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;

    this.recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

        // document.getElementById("p").innerHTML = transcript;
        // this.shadowRoot.querySelector('#searchInput').value = transcript;
        console.log(transcript);
    });

    this.recognition.addEventListener('end', e => {
        console.log('listening done')
        // change back to normal voice icon
        this.shadowRoot.querySelector('.listening').style.display = 'none';
        // this.shadowRoot.querySelector('.voice').style.display = 'block';
        this.shadowRoot.querySelector('#searchInput').placeholder = 'Gainsight Finder';

        this.onInputChange();
    });
}

function listenSpeech() {
    console.log('listening...')
    this.recognition.start();

    // Change placeholder
    this.shadowRoot.querySelector('#searchInput').placeholder = "Listening...";

    // Change icon to some GIF
    this.shadowRoot.querySelector('.listening').style.display = 'block';
    // this.shadowRoot.querySelector('.voice').style.display = 'none';
    this.shadowRoot.querySelector('#searchInput').value = '';
}

class SpeechRecognition {
    
    micElement;
    resultsElement;
    constructor({
        micElementSelector,
        resultsElementSelector
    }) {
        this.micElement = document.querySelector(micElementSelector);
        this.resultsElement = document.querySelector(resultsElementSelector);
    }
}