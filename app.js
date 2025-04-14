
let recording = false;
let recognition;
let transcriptionText = "";
let emotionHistory = [];
let participants = {};  // Dynamisch hinzugefügte Teilnehmer
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
        let currentParticipant = "Unbekannt";  // Initiale Zuweisung
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        transcriptionText += transcript + ' ';
        analyzeEmotion(transcriptionText);
        currentParticipant = identifyParticipant(transcript);
        updateParticipantAvatar(currentParticipant);
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
    // Dynamische Teilnehmerzuweisung basierend auf der Sprache (nicht nur Namen)
    if (!participants["Teilnehmer 1"] && (text.includes("stimme 1") || text.includes("später"))) {
        participants["Teilnehmer 1"] = {
            name: "Teilnehmer 1",
            avatar: "avatar_image_1.png",  // Beispiel-Avatar
        };
        return "Teilnehmer 1";
    } else if (!participants["Teilnehmer 2"] && (text.includes("stimme 2") || text.includes("klingt"))) {
        participants["Teilnehmer 2"] = {
            name: "Teilnehmer 2",
            avatar: "avatar_image_2.png",  // Beispiel-Avatar
        };
        return "Teilnehmer 2";
    }
    return "Unbekannt";  // Fallback, falls Teilnehmer nicht erkannt werden
}

function updateSummary(emotion) {
    const summaryText = `Das Gespräch war überwiegend von Emotionen wie ${emotion} geprägt. Es wurden viele Themen angesprochen.`;
    document.getElementById("summaryText").innerText = summaryText;

    // Update participant summaries based on their name
    updateParticipantSummary();
}

function updateParticipantSummary() {
    let summaryHTML = "";
    for (let key in participants) {
        summaryHTML += `<div class="avatar" id="avatar${key}" style="display: block;">`;
        summaryHTML += `<img src="${participants[key].avatar}" alt="Avatar ${key}" />`;
        summaryHTML += `<p>${participants[key].name}</p>`;
        summaryHTML += `<div class="avatarSummary">${avatars[key].summary}</div>`;
        summaryHTML += `</div>`;
    }
    document.getElementById("avatars").innerHTML = summaryHTML;
}

function updateParticipantAvatar(currentParticipant) {
    const participantId = "avatar" + currentParticipant;
    const avatarElement = document.getElementById(participantId);
    if (avatarElement) {
        avatarElement.style.display = "block"; // Avatar sichtbar machen
    }
}
