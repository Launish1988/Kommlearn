
let recording = false;
let recognition;
let transcriptionText = "";
let emotionHistory = [];
let participants = {};  // Dynamisch hinzugefügte Teilnehmer
let avatars = {
    "Teilnehmer 1": {
        name: "Teilnehmer 1",
        avatar: "avatar_image_1.png",  // Beispiel Avatar
        summary: "Teilnehmer 1 spricht über das Meeting und was als nächstes getan werden muss."
    },
    "Teilnehmer 2": {
        name: "Teilnehmer 2",
        avatar: "avatar_image_2.png",  // Beispiel Avatar
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
        let currentParticipant = identifyParticipant(transcript);
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
    // Dynamische Erkennung der Stimme und Zuordnung zu einem Teilnehmer
    let currentParticipant = "Unbekannt";
    if (text.includes("Kai")) {
        if (!participants["Kai"]) {
            participants["Kai"] = avatars["Teilnehmer 1"];
        }
        currentParticipant = "Kai";
    } else if (text.includes("Lisa")) {
        if (!participants["Lisa"]) {
            participants["Lisa"] = avatars["Teilnehmer 2"];
        }
        currentParticipant = "Lisa";
    } else {
        if (!participants["Teilnehmer 1"]) {
            participants["Teilnehmer 1"] = avatars["Teilnehmer 1"];
        }
        currentParticipant = "Teilnehmer 1";  // Standard Teilnehmer
    }
    return currentParticipant;
}

function updateSummary(emotion) {
    const summaryText = `Das Gespräch war überwiegend von Emotionen wie ${emotion} geprägt. Es wurden viele Themen angesprochen.`;
    document.getElementById("summaryText").innerText = summaryText;

    // Teilnehmer-Zusammenfassung basierend auf deren Gesprächsanteil
    updateParticipantSummary();
}

function updateParticipantSummary() {
    let summaryHTML = "";
    for (let key in participants) {
        summaryHTML += `<div class="avatar" id="avatar${key}" style="display: block;" onclick="viewSummary('${key}')">`;
        summaryHTML += `<img src="${participants[key].avatar}" alt="Avatar ${key}" />`;
        summaryHTML += `<p>${participants[key].name}</p>`;
        summaryHTML += `<div class="avatarSummary">${participants[key].summary}</div>`;
        summaryHTML += `</div>`;
    }
    document.getElementById("avatars").innerHTML = summaryHTML;
}

function updateParticipantAvatar(currentParticipant) {
    // Avatare anzeigen basierend auf der dynamischen Teilnehmerzuweisung
    const participantId = currentParticipant;
    const avatarElement = document.getElementById("avatar" + participantId);
    if (avatarElement) {
        avatarElement.style.display = "block"; // Avatar sichtbar machen
    }
}

function viewSummary(participant) {
    // Weiterleitung zur Detailansicht des Teilnehmers (Zusammenfassung)
    window.location.href = `${participant}_summary.html`;
}
