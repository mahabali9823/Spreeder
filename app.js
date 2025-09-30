const displayBox = document.getElementById('text-display');
const textRadio = document.getElementById('text-radio');
const fileRadio = document.getElementById('file-radio');
const file = document.getElementById('file-input');
const backward = document.getElementById('backward');
const play = document.getElementById('play');
const stops = document.getElementById('stop');
stops.style.display = "none";
const wpmElement = document.getElementById('wpm');

let currentIndex = 0;
let textContent = [];
let timeoutId = null;
let isPlaying = false;

function renderContent() {
    if (textRadio.checked) {
        document.getElementById('file-input-section').style.display = "none";
        document.getElementById('display-result-section').style.display = "none";
        document.getElementById('text-input-section').style.display = "inline";
        file.value = null;
    } else {
        document.getElementById('text-input-section').style.display = "none";
        document.getElementById('display-result-section').style.display = "none";
        document.getElementById('file-input-section').style.display = "inline";
        document.getElementById('submit-display').style.display = "none";
        document.getElementById('text-input').value = "";
    }
}

textRadio.addEventListener('change', renderContent);
fileRadio.addEventListener('change', renderContent);
file.addEventListener('change', fileDataHandler);
backward.addEventListener('click', handleBackward);
play.addEventListener('click', handlePlay);
stops.addEventListener('click', handleStops);

renderContent();

function fileDataHandler(event) {
    const file = event.target.files[0];
    if (!file) return; // exit if no file selected

    const fileReader = new FileReader();

    fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        try {
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                if (textContent.items.length > 0) {
                    const pageText = textContent.items.map(item => item.str || "").join(" ");
                    fullText += pageText + "\n\n";
                } else {
                    fullText += "[No text found on page " + i + "]\n\n";
                }
            }

            const text = fullText.split(' ').filter(word => word.trim() !== '');

            const displayResultSection = document.getElementById('display-result-section');
            if (text.length === 0) {
                displayResultSection.style.display = "none";
            } else {
                displayResultSection.style.display = "inline";
            }
            textContent = text;
            currentIndex = 0;
        } catch (err) {
            console.log(err)
        }
    };
    fileReader.readAsArrayBuffer(file); // read PDF as binary
}

function handleInput() {
    document.getElementById('submit-display').style.display = "inline";
    const inputBox = document.getElementById('text-input');
    const textInputSection = document.getElementById('text-input-section');
    const displayResultSection = document.getElementById('display-result-section');

    textInputSection.style.display = "none";
    displayResultSection.style.display = "inline";

    const text = inputBox.value.split(' ');
    textContent = text;
    currentIndex = 0;
};

function handleDisplay() {
    const inputBox = document.getElementById('text-input');
    const textInputSection = document.getElementById('text-input-section');
    const displayResultSection = document.getElementById('display-result-section');

    textInputSection.style.display = "inline";
    displayResultSection.style.display = "none";

    inputBox.innerText = " ";
}

function handleBackward() {
    isPlaying = false;
    currentIndex = 0;
    clearTimeout(timeoutId);
    timeoutId = null;
    displayBox.innerText = "";
    play.style.display = "inline";
    stops.style.display = "none";
}

function handlePlay() {
    play.style.display = "none";
    stops.style.display = "inline";

    isPlaying = true;
    const wpmValue = wpmElement.value;
    const delay = wpmValue ? (60000 / parseInt(wpmValue)) : 500;    

    function displayNextWord() {
        if (!isPlaying || currentIndex >= textContent.length) return;
        displayBox.innerText = textContent[currentIndex];
        currentIndex++;
        timeoutId = setTimeout(displayNextWord, delay);
    }
    displayNextWord();
}

function handleStops() {
    stops.style.display = "none";
    play.style.display = "inline";

    isPlaying = false;
    clearTimeout(timeoutId);
    timeoutId = null;
}