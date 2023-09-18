
//START Bubble Chat Dinamis
const inputUser = document.getElementById('inputUser');
const pertanyaan = document.getElementById('outputTanya');
const resetButton = document.getElementById("resetButton");
const chatgpt = document.getElementById('chatgpt');
const stablediff = document.getElementById('stablediff');
const heading = document.getElementById('heading');
const colorgpt = document.getElementById('chatColorGPT');
const colorsdiff = document.getElementById('chatColorSdiff');

var previousChatContentGPT = "";
var gptChatContent = "";
var sdiffChatContent = "";
var gpt = true;


//WAKTU
const currentTime = new Date();
const hours = currentTime.getHours();
const minutes = currentTime.getMinutes();
let timeString = '';

// Format jam dalam format 12 jam (hh:mm AM/PM)
if (hours >= 12) {
    timeString = `${(hours === 12 ? 12 : hours - 12)}:${minutes.toString().padStart(2, '0')} PM`;
} else {
    timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} AM`;
}

kondisiAwalGPT();


function showChat(contact) {
    var chatContent = outputTanya.innerHTML;
    if (contact === 'chatgpt') {
        if (gpt) {
            return;
        }
        heading.innerHTML = 'ChatGPT';
        colorgpt.style.backgroundColor = '#eee';
        colorsdiff.style.backgroundColor = '#fff';
        gpt = true;
        sdiffChatContent = chatContent;
        outputTanya.innerHTML = gptChatContent;
        var liCount = outputTanya.childElementCount;
        if (liCount <= 1) {
            kondisiAwalGPT();
        }
        outputTanya.scrollTop = outputTanya.scrollHeight;
    } else if (contact === 'stablediffusion') {
        if (!gpt) {
            return;
        }
        heading.innerHTML = 'Stable Diffusion';
        colorsdiff.style.backgroundColor = '#eee';
        colorgpt.style.backgroundColor = '#fff';
        gpt = false;
        gptChatContent = chatContent;
        outputTanya.innerHTML = sdiffChatContent;
        var liCount = outputTanya.childElementCount;
        if (liCount <= 1) {
            kondisiAwalStbl();
        }
        outputTanya.scrollTop = outputTanya.scrollHeight;
    }
}

function processUserInput() {
    var heading = document.getElementById("heading").innerHTML;
    if (heading === "Stable Diffusion") {
        const userInput = inputUser.value;
        sendUserInputSdiff(userInput);
        inputUser.value = '';
        const newLi = document.createElement('li');
        newLi.classList.add('d-flex', 'justify-content-end', 'mb-4');
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
        const userParagraph = document.createElement('p');
        userParagraph.classList.add('fw-bold', 'mb-0');
        userParagraph.style.marginRight = '10px';
        userParagraph.style.textAlign = 'right';
        userParagraph.textContent = 'Anda';
        const timeParagraph = document.createElement('p');
        timeParagraph.classList.add('text-muted', 'small', 'mb-0');
        timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-end');
        const messageParagraph = document.createElement('p');
        messageParagraph.classList.add('mb-0');
        messageParagraph.textContent = userInput;
        const avatarImage = document.createElement('img');
        avatarImage.src = 'https://pbs.twimg.com/profile_images/1298507636216696833/A4U7Zan2_400x400.jpg';
        avatarImage.alt = 'avatar';
        avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
        avatarImage.width = 60;
        avatarImage.style.marginRight = '10px';
        cardHeader.appendChild(userParagraph);
        cardHeader.appendChild(timeParagraph);
        cardBody.appendChild(messageParagraph);
        newCard.appendChild(cardHeader);
        newCard.appendChild(cardBody);
        newLi.appendChild(newCard);
        newLi.appendChild(avatarImage);
        pertanyaan.appendChild(newLi);
        outputTanya.scrollTop = outputTanya.scrollHeight;
    } else if (heading === "ChatGPT") {
        const userInput = inputUser.value;
        sendUserInputGPT(userInput);
        inputUser.value = '';
        const newLi = document.createElement('li');
        newLi.classList.add('d-flex', 'justify-content-end', 'mb-4');
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
        const userParagraph = document.createElement('p');
        userParagraph.classList.add('fw-bold', 'mb-0');
        userParagraph.style.marginRight = '10px';
        userParagraph.style.textAlign = 'right';
        userParagraph.textContent = 'Anda';
        const timeParagraph = document.createElement('p');
        timeParagraph.classList.add('text-muted', 'small', 'mb-0');
        timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-end');
        const messageParagraph = document.createElement('p');
        messageParagraph.classList.add('mb-0');
        messageParagraph.textContent = userInput;
        const avatarImage = document.createElement('img');
        avatarImage.src = 'https://pbs.twimg.com/profile_images/1298507636216696833/A4U7Zan2_400x400.jpg';
        avatarImage.alt = 'avatar';
        avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
        avatarImage.width = 60;
        avatarImage.style.marginRight = '10px';
        cardHeader.appendChild(userParagraph);
        cardHeader.appendChild(timeParagraph);
        cardBody.appendChild(messageParagraph);
        newCard.appendChild(cardHeader);
        newCard.appendChild(cardBody);
        newLi.appendChild(newCard);
        newLi.appendChild(avatarImage);
        pertanyaan.appendChild(newLi);
        outputTanya.scrollTop = outputTanya.scrollHeight;
    }
}

function kondisiAwalGPT() {
    document.getElementById('outputTanya').innerHTML = '';
    const newLi = document.createElement('li');
    newLi.classList.add('d-flex', 'justify-content-start', 'mb-4');
    const avatarImage = document.createElement('img');
    avatarImage.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/768px-ChatGPT_logo.svg.png?20230318122128';
    avatarImage.alt = 'avatar';
    avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    avatarImage.width = 60;
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.style.marginRight = '10px';
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    const userParagraph = document.createElement('p');
    userParagraph.classList.add('fw-bold', 'mb-0');
    userParagraph.style.marginRight = '10px';
    userParagraph.textContent = 'ChatGPT';
    const timeParagraph = document.createElement('p');
    timeParagraph.classList.add('text-muted', 'small', 'mb-0');
    timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add('mb-0');
    messageParagraph.textContent = 'Halo! Saya ChatGPT, sebuah model bahasa AI dari OpenAI. Saya dilatih untuk membantu dengan berbagai pertanyaan dan masalah yang Anda miliki. Jadi, apa yang bisa saya bantu hari ini?';
    cardHeader.appendChild(userParagraph);
    cardHeader.appendChild(timeParagraph);
    cardBody.appendChild(messageParagraph);
    newCard.appendChild(cardHeader);
    newCard.appendChild(cardBody);
    newLi.appendChild(avatarImage);
    newLi.appendChild(newCard);
    outputTanya.appendChild(newLi);
    outputTanya.scrollTop = outputTanya.scrollHeight;
}

function kondisiAwalStbl() {
    document.getElementById('outputTanya').innerHTML = '';
    const newLi = document.createElement('li');
    newLi.classList.add('d-flex', 'justify-content-start', 'mb-4');
    const avatarImage = document.createElement('img');
    avatarImage.src = 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/yaun2ev6hp27dz6lkhjv';
    avatarImage.alt = 'avatar';
    avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    avatarImage.width = 60;
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.style.marginRight = '10px';
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    const userParagraph = document.createElement('p');
    userParagraph.classList.add('fw-bold', 'mb-0');
    userParagraph.style.marginRight = '10px';
    userParagraph.textContent = 'Stable Diffusion';
    const timeParagraph = document.createElement('p');
    timeParagraph.classList.add('text-muted', 'small', 'mb-0');
    timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add('mb-0');
    messageParagraph.textContent = 'Halo! Saya StableDiffusion, sebuah model untuk menghasilkan gambar dengan memanfaatkan difusi stabil dan algoritma generatif menggunakan AI. Jadi, apa yang bisa saya bantu hari ini?';
    cardHeader.appendChild(userParagraph);
    cardHeader.appendChild(timeParagraph);
    cardBody.appendChild(messageParagraph);
    newCard.appendChild(cardHeader);
    newCard.appendChild(cardBody);
    newLi.appendChild(avatarImage);
    newLi.appendChild(newCard);
    outputTanya.appendChild(newLi);
    outputTanya.scrollTop = outputTanya.scrollHeight;
}

function sendUserInputGPT(userInput) {
    fetch('/process_user_input_gpt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: userInput })
    })
        .then(response => response.json())
        .then(data => {
            const newLi = document.createElement('li');
            newLi.classList.add('d-flex', 'justify-content-start', 'mb-4');
            const avatarImage = document.createElement('img');
            avatarImage.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/768px-ChatGPT_logo.svg.png?20230318122128';
            avatarImage.alt = 'avatar';
            avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
            avatarImage.width = 60;
            const newCard = document.createElement('div');
            newCard.classList.add('card');
            newCard.style.marginRight = '10px';
            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
            const userParagraph = document.createElement('p');
            userParagraph.classList.add('fw-bold', 'mb-0');
            userParagraph.style.marginRight = '10px';
            userParagraph.textContent = 'ChatGPT';
            const timeParagraph = document.createElement('p');
            timeParagraph.classList.add('text-muted', 'small', 'mb-0');
            timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const messageParagraph = document.createElement('p');
            messageParagraph.classList.add('mb-0');
            messageParagraph.textContent = data.answer;
            cardHeader.appendChild(userParagraph);
            cardHeader.appendChild(timeParagraph);
            cardBody.appendChild(messageParagraph);
            newCard.appendChild(cardHeader);
            newCard.appendChild(cardBody);
            newLi.appendChild(avatarImage);
            newLi.appendChild(newCard);
            outputTanya.appendChild(newLi);
            outputTanya.scrollTop = outputTanya.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function sendUserInputSdiff(userInput) {
    fetch('/process_user_input_sdiff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: userInput })
    })
        .then(response => response.json())
        .then(data => {
            const newLi = document.createElement('li');
            newLi.classList.add('d-flex', 'justify-content-start', 'mb-4');
            const avatarImage = document.createElement('img');
            avatarImage.src = 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/yaun2ev6hp27dz6lkhjv';
            avatarImage.alt = 'avatar';
            avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
            avatarImage.width = 60;
            const newCard = document.createElement('div');
            newCard.classList.add('card');
            newCard.style.marginRight = '10px';
            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
            const userParagraph = document.createElement('p');
            userParagraph.classList.add('fw-bold', 'mb-0');
            userParagraph.style.marginRight = '10px';
            userParagraph.textContent = 'Stable Diffusion';
            const timeParagraph = document.createElement('p');
            timeParagraph.classList.add('text-muted', 'small', 'mb-0');
            timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const imageUrl = `/pics/1.png?timestamp=${Date.now()}`; // Tambahkan parameter unik menggunakan timestamp
            const imageResult = document.createElement('img');
            imageResult.id = 'myImg';
            imageResult.src = imageUrl;
            imageResult.alt = 'gambar';
            //imageResult.classList.add('mb-0');
            imageResult.classList.add('img-fluid');
            imageResult.style.borderRadius = '10px';
            cardBody.appendChild(imageResult);
            cardHeader.appendChild(userParagraph);
            cardHeader.appendChild(timeParagraph);
            newCard.appendChild(cardHeader);
            newCard.appendChild(cardBody);
            newLi.appendChild(avatarImage);
            newLi.appendChild(newCard);
            outputTanya.appendChild(newLi);
            outputTanya.scrollTop = outputTanya.scrollHeight;
        })
}

document.getElementById("inputUser").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        var heading = document.getElementById("heading").innerHTML;
        if (heading === "Stable Diffusion") {
            const userInput = inputUser.value;
            sendUserInputSdiff(userInput);
            inputUser.value = '';
            const newLi = document.createElement('li');
            newLi.classList.add('d-flex', 'justify-content-end', 'mb-4');
            const newCard = document.createElement('div');
            newCard.classList.add('card');
            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
            const userParagraph = document.createElement('p');
            userParagraph.classList.add('fw-bold', 'mb-0');
            userParagraph.style.marginRight = '10px';
            userParagraph.style.textAlign = 'right';
            userParagraph.textContent = 'Anda';
            const timeParagraph = document.createElement('p');
            timeParagraph.classList.add('text-muted', 'small', 'mb-0');
            timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'text-end');
            const messageParagraph = document.createElement('p');
            messageParagraph.classList.add('mb-0');
            messageParagraph.textContent = userInput;
            const avatarImage = document.createElement('img');
            avatarImage.src = 'https://pbs.twimg.com/profile_images/1298507636216696833/A4U7Zan2_400x400.jpg';
            avatarImage.alt = 'avatar';
            avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
            avatarImage.width = 60;
            avatarImage.style.marginRight = '10px';
            cardHeader.appendChild(userParagraph);
            cardHeader.appendChild(timeParagraph);
            cardBody.appendChild(messageParagraph);
            newCard.appendChild(cardHeader);
            newCard.appendChild(cardBody);
            newLi.appendChild(newCard);
            newLi.appendChild(avatarImage);
            pertanyaan.appendChild(newLi);
            outputTanya.scrollTop = outputTanya.scrollHeight;
        } else if (heading === "ChatGPT") {
            const userInput = inputUser.value;
            sendUserInputGPT(userInput);
            inputUser.value = '';
            const newLi = document.createElement('li');
            newLi.classList.add('d-flex', 'justify-content-end', 'mb-4');
            const newCard = document.createElement('div');
            newCard.classList.add('card');
            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
            const userParagraph = document.createElement('p');
            userParagraph.classList.add('fw-bold', 'mb-0');
            userParagraph.style.marginRight = '10px';
            userParagraph.style.textAlign = 'right';
            userParagraph.textContent = 'Anda';
            const timeParagraph = document.createElement('p');
            timeParagraph.classList.add('text-muted', 'small', 'mb-0');
            timeParagraph.innerHTML = `<i class="far fa-clock" style="margin-right: 10px;"></i>${timeString}`;
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'text-end');
            const messageParagraph = document.createElement('p');
            messageParagraph.classList.add('mb-0');
            messageParagraph.textContent = userInput;
            const avatarImage = document.createElement('img');
            avatarImage.src = 'https://pbs.twimg.com/profile_images/1298507636216696833/A4U7Zan2_400x400.jpg';
            avatarImage.alt = 'avatar';
            avatarImage.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
            avatarImage.width = 60;
            avatarImage.style.marginRight = '10px';
            cardHeader.appendChild(userParagraph);
            cardHeader.appendChild(timeParagraph);
            cardBody.appendChild(messageParagraph);
            newCard.appendChild(cardHeader);
            newCard.appendChild(cardBody);
            newLi.appendChild(newCard);
            newLi.appendChild(avatarImage);
            pertanyaan.appendChild(newLi);
            outputTanya.scrollTop = outputTanya.scrollHeight;
        }
    }
});

const img = document.querySelector("#myImage");
const modal = document.querySelector("#myModal");
const modalImg = document.querySelector("#img01");
const captionText = document.querySelector("#caption");

img.onclick = function() {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
};

var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}