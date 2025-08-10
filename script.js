// ====== CONFIGURACIÓN ======
const BACKEND_URL =  "https://tutor-backend-7ldm.onrender.com";// Cambia esta URL por la de tu backend

// ====== ELEMENTOS DEL DOM ======
const chatDiv = document.getElementById("chat");
const input = document.getElementById("input");

// ====== ENVIAR MENSAJE ======
async function sendMessage() {
  const message = input.value.trim();
  if (!message) {
    console.warn("⚠️ Mensaje vacío, no se envía.");
    return;
  }

  addMessage(message, "user");
  input.value = "";

  console.log("📡 Enviando mensaje al backend:", BACKEND_URL, "Mensaje:", message);

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    console.log("📥 Estado HTTP:", res.status);

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("📄 Respuesta JSON:", data);

    if (data.reply) {
      addMessage(data.reply, "bot");
      speak(data.reply);
    } else {
      console.error("❌ Respuesta sin 'reply'.");
    }

  } catch (error) {
    console.error("💥 Error al conectar con el backend:", error);
    addMessage("Error: no pude conectarme con el servidor.", "bot");
  }
}

// ====== AGREGAR MENSAJE AL CHAT ======
function addMessage(text, sender) {
  const msg = document.createElement("p");
  msg.textContent = text;
  msg.className = sender;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// ====== TEXTO A VOZ ======
function speak(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Cambia según el idioma
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("🎤 Error al convertir texto a voz:", error);
  }
}

// ====== RECONOCIMIENTO DE VOZ ======
function startVoice() {
  try {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Cambia según el idioma
    recognition.onresult = (event) => {
      input.value = event.results[0][0].transcript;
      sendMessage();
    };
    recognition.start();
  } catch (error) {
    console.error("🎙️ Error al iniciar reconocimiento de voz:", error);
  }

