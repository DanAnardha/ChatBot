micButton.addEventListener('click', function () {
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    var labelElement = document.getElementById('label');
    labelElement.textContent = '';
    var micButtonElement = document.getElementById('micButton');
    const output = document.getElementById('inputUser');

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
        output.value = transcript;
    })

    recognition.addEventListener('start', function () {
        micButtonElement.style.backgroundColor = 'red';
    });

    recognition.addEventListener('end', function () {
        micButtonElement.style.backgroundColor = '';
        labelElement.textContent = 'Masukkan teks...';
        processUserInput();
    });
    if(speech == true) {
        recognition.start();
    }
})