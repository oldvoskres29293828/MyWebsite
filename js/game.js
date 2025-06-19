// Функция для отправки сообщения в Firestore
function postMessage(messageText) {
  db.collection("messages").add({
    text: messageText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Сообщение добавлено!");
  })
  .catch(error => {
    console.error("Ошибка добавления сообщения: ", error);
  });
}

// Функция для отображения сообщений из Firestore
function displayMessages() {
  db.collection("messages")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      const messagesContainer = document.getElementById("messages");
      messagesContainer.innerHTML = ''; // Очищаем контейнер перед выводом новых сообщений
      snapshot.forEach(doc => {
        const messageData = doc.data();
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<p>${messageData.text}</p>`;
        messagesContainer.appendChild(messageElement);
      });
    });
}

// Запуск отображения сообщений при загрузке страницы
displayMessages();

// Обработчик отправки нового сообщения
document.getElementById('postMessage').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value.trim();
  
  if (messageText) {
    postMessage(messageText);
    messageInput.value = '';  // Очищаем поле ввода
  } else {
    alert('Пожалуйста, введите сообщение!');
  }
});
