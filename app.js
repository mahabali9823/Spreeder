const textRadio = document.getElementById('text-radio');
const fileRadio = document.getElementById('file-radio');
const file = document.getElementById('file-input');
const wpmElement = document.getElementById('wpm');
console.log({ textRadio, fileRadio });


function renderContent() {
    if (textRadio.checked) {
        document.getElementById('text-input-section').style.display = "inline";
        document.getElementById('file-input-section').style.display = "none";
    } else {
        document.getElementById('text-input-section').style.display = "none";
        document.getElementById('file-input-section').style.display = "inline";
        document.getElementById('submit-display').style.display = "none";
        const displayResultSection = document.getElementById('display-result-section');
        if (file.files.length === 0) {
            displayResultSection.style.display = "none";
        } else {
            displayResultSection.style.display = "inline";
        }
    }
}

textRadio.addEventListener('change', renderContent);
fileRadio.addEventListener('change', renderContent);
file.addEventListener('change', fileDataHandler);

renderContent();

function fileDataHandler(event) {
    renderContent();
    const displayBox = document.getElementById('text-display');
    const wpmValue = wpmElement.value;
    const delay = wpmValue ? (60000 / parseInt(wpmValue)) : 500;

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
            console.log('pdf',{ wpmValue, delay });
            for (let i = 0; i < text.length; i++) {
                setTimeout(() => {
                    displayBox.innerText = text[i];
                }, i * delay);
            }

        } catch (err) {
            console.log(err)
        }
    };
    fileReader.readAsArrayBuffer(file); // read PDF as binary
}

function handleInput() {
    const inputBox = document.getElementById('text-input');
    const displayBox = document.getElementById('text-display');
    const textInputSection = document.getElementById('text-input-section');
    const displayResultSection = document.getElementById('display-result-section');
    const wpmValue = wpmElement.value;
    const delay = wpmValue ? (60000 / parseInt(wpmValue)) : 500;

    console.log('text',{ wpmValue, delay });

    textInputSection.style.display = "none";
    displayResultSection.style.display = "inline";

    const text = inputBox.value.split(' ');
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            displayBox.innerText = text[i];
        }, i * delay);
    }
};

function handleDisplay() {
    const inputBox = document.getElementById('text-input');
    const textInputSection = document.getElementById('text-input-section');
    const displayResultSection = document.getElementById('display-result-section');

    textInputSection.style.display = "inline";
    displayResultSection.style.display = "none";

    inputBox.innerText = " ";
}


// function handleInput() {
//     const inputBox = document.getElementById('text-input');
//     const displayBox = document.getElementById('text-display');
//     const submitInput = document.getElementById('submit-input');
//     const submitDisplay = document.getElementById('submit-display');

//     console.log(inputBox);

//     inputBox.style.display = "none";
//     submitInput.style.display = "none";
//     displayBox.style.display = "inline";
//     submitDisplay.style.display = "inline";

//     const text = inputBox.value.split(' ');
//     console.log(text);
//     for(let i = 0; i < text.length; i++) {
//         setTimeout(() => {
//             displayBox.innerText = text[i];
//         },  i * 500);
//     }
// };

// function handleDisplay() {
//     const inputBox = document.getElementById('text-input');
//     const displayBox = document.getElementById('text-display');
//     const submitInput = document.getElementById('submit-input');
//     const submitDisplay = document.getElementById('submit-display');

//     inputBox.style.display = "inline";
//     submitInput.style.display = "inline";
//     displayBox.style.display = "none";
//     submitDisplay.style.display = "none";
//     inputBox.innerText = " ";
// }