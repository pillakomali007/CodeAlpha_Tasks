let speechEnabled = true;

const LANG_MAP = {
    en: "English",
    te: "Telugu",
    hi: "Hindi",
    ta: "Tamil",
    kn: "Kannada",
    ml: "Malayalam",
    bn: "Bengali",
    fr: "French",
    de: "German",
    es: "Spanish",
    it: "Italian",
    pt: "Portuguese",
    ar: "Arabic",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ru: "Russian",
    sv: "Swedish",
    no: "Norwegian",
    hr: "Croatian"
};

async function translateText() {

    const text = document.getElementById("inputText").value;
    const target = document.getElementById("targetLang").value;

    if (!text.trim()) {
        alert("Please enter text");
        return;
    }

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                target: target
            })
        });

        const data = await response.json();
        let infoHTML="";
        

let historyHTML = "";

data.history.forEach(item => {
    historyHTML += `<li>${item.original} → ${item.translated}</li>`;
});

document.getElementById("history").innerHTML = historyHTML;



        const chat = document.getElementById("chatContainer");

        chat.innerHTML += `
            <div class="user-message">
                ${text}
            </div>
        `;

    
          chat.innerHTML += `
<div class="bot-message">

    <div class="msg-text">
        ${data.translated}
    </div>

    <div class="actions">
        <button onclick="copyText(this)">📋 Copy</button>
      <button onclick="speakText(this)">🔊 Speak</button>
      ${infoHTML}
    </div>

   
</div>
`;

        document.getElementById("inputText").value = "";

        chat.scrollTop = chat.scrollHeight;

    } catch (error) {
        console.error(error);
        alert("Translation failed");
    }
}
function copyText(btn) {
    const text = btn.closest(".bot-message").querySelector(".msg-text").innerText;
 
    navigator.clipboard.writeText(text);
    alert("Copied!");
}

function speakText(btn){

    // Stop any previous speech first
    window.speechSynthesis.cancel();

    if(!speechEnabled){
        alert("Speaker is OFF");
        return;
    }

    const text = btn.closest(".bot-message")
        .querySelector(".msg-text").innerText;

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

function toggleSpeech() {

    speechEnabled = !speechEnabled;

    const btn = document.getElementById("speakerBtn");

    if (speechEnabled) {
        btn.innerText = "🔊 ON";
    } else {

        btn.innerText = "🔇 OFF";

        // Immediately stop speaking
        window.speechSynthesis.cancel();

        // Extra safety
        window.speechSynthesis.pause();
    }
}
function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Mic not supported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function (event) {
        document.getElementById("inputText").value =
            event.results[0][0].transcript;
    };
}

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const btn = document.getElementById("themeBtn");

    if (document.body.classList.contains("dark-mode")) {
        btn.innerText = "☀️ Light Mode";
    } else {
        btn.innerText = "🌙 Dark Mode";
    }
}


