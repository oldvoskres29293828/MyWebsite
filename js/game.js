// Функция для отображения сообщений
function displayMessages() {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = ''; // Очищаем контейнер перед выводом новых сообщений

  const messages = JSON.parse(localStorage.getItem('messages')) || [];

  messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
      <p>${message.text}</p>
      <button class="replyButton">Ответить</button>
      <div class="replies"></div>
    `;

    // Добавляем обработчик для кнопки "Ответить"
    const replyButton = messageElement.querySelector('.replyButton');
    replyButton.addEventListener('click', () => {
      const replyText = prompt('Ваш ответ:');
      if (replyText) {
        message.replies.push(replyText);  // Добавляем ответ к сообщению
        saveMessages();  // Сохраняем изменения
        displayMessages();  // Обновляем отображение сообщений
      }
    });

    // Отображаем ответы
    const repliesContainer = messageElement.querySelector('.replies');
    message.replies.forEach(reply => {
      const replyElement = document.createElement('div');
      replyElement.classList.add('reply');
      replyElement.innerText = reply;
      repliesContainer.appendChild(replyElement);
    });

    messagesContainer.appendChild(messageElement);
  });
}

// Функция для сохранения сообщений в localStorage
function saveMessages() {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  localStorage.setItem('messages', JSON.stringify(messages));
}

// Обработчик отправки нового сообщения
document.getElementById('postMessage').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value.trim();
  
  if (messageText) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const newMessage = {
      text: messageText,
      replies: []  // Начальные ответы
    };
    
    messages.push(newMessage);
    saveMessages();
    displayMessages();

    messageInput.value = '';  // Очищаем поле ввода
  } else {
    alert('Пожалуйста, введите сообщение!');
  }
});

// Инициализация и отображение сообщений при загрузке страницы
displayMessages();
