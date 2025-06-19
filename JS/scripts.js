// Функция для отправки сообщения в Firestore
function postMessage(messageText) {
  db.collection("messages").add({
    text: messageText,
    replies: [], // Массив для хранения ответов на сообщение
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Сообщение добавлено!");
  })
  .catch(error => {
    console.error("Ошибка добавления сообщения: ", error);
  });
}

// Функция для отправки ответа на сообщение
function postReply(messageId, replyText) {
  const messageRef = db.collection("messages").doc(messageId);

  messageRef.update({
    replies: firebase.firestore.FieldValue.arrayUnion(replyText)
  })
  .then(() => {
    console.log("Ответ добавлен!");
  })
  .catch(error => {
    console.error("Ошибка добавления ответа: ", error);
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
        const messageId = doc.id;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
          <p>${messageData.text}</p>
          <button class="replyButton">Ответить</button>
          <div class="replies">
            ${messageData.replies.map(reply => `<div class="reply">${reply}</div>`).join('')}
          </div>
        `;

        // Обработчик кнопки "Ответить"
        const replyButton = messageElement.querySelector('.replyButton');
        replyButton.addEventListener('click', () => {
          const replyText = prompt('Ваш ответ:');
          if (replyText) {
            postReply(messageId, replyText); // Отправляем ответ в Firestore
          }
        });

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
