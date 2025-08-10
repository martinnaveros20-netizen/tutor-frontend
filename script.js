const chatDiv = document.getElementById("chat");
const input = document.getElementById("input");

async function sendMessage() {
  const message = input.value;
  if (!message) return;
  addMessage(message, "user");
  input.value = "";

  const res = await fetch("https://idiomame.vercel.app/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  addMessage(data.reply, "bot");
  speak(data.reply);
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
  }

