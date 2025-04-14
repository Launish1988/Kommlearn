
let recording = false;
let recognition;
let transcriptionText = "";
let emotionHistory = [];
let currentParticipant = "Teilnehmer 1";  // Dynamisch zugewiesener Teilnehmer
let avatars = {
    "Teilnehmer 1": {
        name: "Teilnehmer 1",
        summary: "Teilnehmer 1 spricht über das Meeting und was als nächstes getan werden muss."
    },
    "Teilnehmer 2": {
        name: "Teilnehmer 2",
        summary: "Teilnehmer 2 spricht über wichtige Entscheidungen und die nächsten Schritte."
    }
};

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
        analyzeEmotion(transcriptionText);
        identifyParticipant(transcript);
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
    updateSummary(emotion);
}

function identifyParticipant(text) {
    // Dynamische Zuweisung von Teilnehmern basierend auf den erkannten Namen
    if (text.includes("Kai")) {
        currentParticipant = "Kai";
        document.getElementById("participant1").innerText = "Kai";
        document.getElementById("avatar1").style.display = "block";
        document.getElementById("avatar2").style.display = "none";  // Andere Teilnehmer Avatar ausblenden
    } else if (text.includes("Sophie")) {
        currentParticipant = "Sophie";
        document.getElementById("participant2").innerText = "Sophie";
        document.getElementById("avatar2").style.display = "block";
        document.getElementById("avatar1").style.display = "none";  // Andere Teilnehmer Avatar ausblenden
    }
}

function updateSummary(emotion) {
    const summaryText = `Das Gespräch war überwiegend von Emotionen wie ${emotion} geprägt. Es wurden viele Themen angesprochen.`;
    document.getElementById("summaryText").innerText = summaryText;

    // Update participant summaries based on their name
    updateParticipantSummary();
}

function updateParticipantSummary() {
    const participant1Summary = document.getElementById("participant1Summary");
    const participant2Summary = document.getElementById("participant2Summary");

    participant1Summary.innerText = avatars["Teilnehmer 1"].summary;
    participant2Summary.innerText = avatars["Teilnehmer 2"].summary;

    // Add click event to avatars to navigate to the new page with their summary
    document.getElementById("avatar1").addEventListener('click', function() {
        window.location.href = "participant1_summary.html";
    });
    document.getElementById("avatar2").addEventListener('click', function() {
        window.location.href = "participant2_summary.html";
    });
}
