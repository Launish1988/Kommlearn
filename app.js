
let recording = false;
let recognition;
let transcriptionText = "";
let emotionHistory = []; 
let avatars = {
    Alex: {
        name: 'Alex',
        summary: 'Alex spricht viel über das nächste Projekt.'
    },
    Sophie: {
        name: 'Sophie',
        summary: 'Sophie spricht über die Herausforderungen bei der Arbeit.'
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

function updateSummary(emotion) {
    const summaryText = `Das Gespräch war überwiegend von Emotionen wie ${emotion} geprägt. Es wurden viele Themen angesprochen.`;
    document.getElementById("summaryText").innerText = summaryText;
    
    // Update each avatar's individual summary
    updateAvatarSummary();
}

function updateAvatarSummary() {
    const alexSummary = document.getElementById("alexSummary");
    const sophieSummary = document.getElementById("sophieSummary");

    // Assigning summary per avatar
    alexSummary.innerText = avatars.Alex.summary;
    sophieSummary.innerText = avatars.Sophie.summary;
    
    // Add click event to avatars to display their summary
    document.getElementById("avatarAlex").addEventListener('click', function() {
        alert(avatars.Alex.summary);
    });
    document.getElementById("avatarSophie").addEventListener('click', function() {
        alert(avatars.Sophie.summary);
    });
}
