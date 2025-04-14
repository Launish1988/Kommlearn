
let recording = false;
let recognition;
let transcriptionText = "";
let emotionHistory = []; 
let avatars = ['Alex', 'Sophie'];

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        
        transcriptionText += transcript + ' '; 
        document.getElementById("transcribedText").innerText = transcriptionText;

        analyzeEmotion(transcriptionText);
    };

    recognition.onerror = function(event) {
        console.error('Fehler bei der Spracherkennung: ', event.error);
    };
}

document.getElementById("startBtn").addEventListener('click', function() {
    if (!recording) {
        startRecording();
    } else {
        stopRecording();
    }
});

function startRecording() {
    recognition.start();
    recording = true;
    document.getElementById("startBtn").innerText = "Aufnahme stoppen";
}

function stopRecording() {
    recognition.stop();
    recording = false;
    document.getElementById("startBtn").innerText = "Aufnahme starten";
}

function analyzeEmotion(text) {
    let emotion = 'Neutral';
    if (text.includes("glücklich") || text.includes("freude")) {
        emotion = 'Fröhlich';
    } else if (text.includes("traurig") || text.includes("verärgert")) {
        emotion = 'Traurig';
    }
    document.getElementById("emotionResult").innerText = "Emotion: " + emotion;
    updateDashboard(emotion);
}

function updateDashboard(emotion) {
    const topContents = document.getElementById("topContents");
    topContents.innerHTML = '';
    const newItem = document.createElement("li");
    newItem.textContent = "Gesprächsinhalt: " + emotion;
    topContents.appendChild(newItem);
    
    document.getElementById("avatarNames").innerText = "Teilnehmer: " + avatars.join(", ");
}
