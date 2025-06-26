const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const speakButton = document.getElementById('speak-button');
const stopButton = document.getElementById('stop-button');
const errorMessage = document.getElementById('error-message');

let synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
    voices = synth.getVoices().sort((a, b) => {
        const langA = a.lang.toLowerCase();
        const langB = b.lang.toLowerCase();
        if (langA < langB) return -1;
        if (langA > langB) return 1;
        return 0;
    });

    if (voices.length === 0) {
        errorMessage.textContent = "No speech synthesis voices available in your browser.";
        speakButton.disabled = true;
        stopButton.disabled = true;
        return;
    } else {
        errorMessage.textContent = "";
        speakButton.disabled = false;
        stopButton.disabled = false;
    }

    voiceSelect.innerHTML = '';
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        if (voice.name === 'Rishi' && voice.lang === 'en-IN') {
            option.selected = true;
        } else if (!voiceSelect.querySelector('[selected]')) {
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
}

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
} else {
    populateVoiceList();
}

function speakText() {
    if (synth.speaking) {
        synth.cancel();
    }

    const text = textInput.value.trim();
    if (text === '') {
        errorMessage.textContent = "Please enter text to speak.";
        return;
    } else {
        errorMessage.textContent = "";
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const selectedVoiceLang = voiceSelect.selectedOptions[0].getAttribute('data-lang');
    utterance.voice = voices.find(voice => voice.name === selectedVoiceName && voice.lang === selectedVoiceLang);

    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);

    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        errorMessage.textContent = `Speech synthesis error: ${event.error}`;
    };

    utterance.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    };

    synth.speak(utterance);
}

speakButton.addEventListener('click', speakText);

stopButton.addEventListener('click', () => {
    if (synth.speaking) {
        synth.cancel();
    }
});

rateInput.addEventListener('input', () => {
    if (synth.speaking) {
        speakText();
    }
});

pitchInput.addEventListener('input', () => {
    if (synth.speaking) {
        speakText();
    }
});

voiceSelect.addEventListener('change', () => {
    if (synth.speaking) {
        speakText();
    }
});

populateVoiceList();