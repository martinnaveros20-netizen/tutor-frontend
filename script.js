const chatDiv = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

const BACKEND_URL = "https://idiomame.vercel.app//chat";

// Eventos
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    addMessage(data.reply, "bot");
    speak(data.reply);
  } catch (error) {
    addMessage("Error: no pude conectarme con el servidor.", "bot");
  }
}

function addMessage(text, sender) {
  const msg = document.createElement("p");
  msg.textContent = text;
  msg.className = sender;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    sendMessage();
  };
  recognition.start();
}
