// 🔧 Настройки Firebase — замени своими данными из консоли Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcKl7MYsjts5mvTf6Tpp1luePwt2TOYvU",
  authDomain: "website-683a6.firebaseapp.com",
  projectId: "website-683a6",
  storageBucket: "website-683a6.appspot.com",
  messagingSenderId: "879721526266",
  appId: "1:879721526266:web:9b57e581e583f3aa97ea43"
};

// 🧠 Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Отправка сообщения
function postMessage(text) {
  db.collection("messages").add({
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ▶️ Обработчик кнопки
document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (text) {
    postMessage(text);
    input.value = "";
  }
});

// 👀 Загрузка сообщений и отображение
db.collection("messages")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = data.text || "[пустое сообщение]";
      container.appendChild(div);
    });
  });
