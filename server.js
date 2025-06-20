const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let users = []; // [{username, login, socketId}]
let globalMessages = []; // [{user, text, time}]
let privateMessages = {}; // {'user1:user2': [{from, to, text, time}]}

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // Регистрация пользователя
  socket.on('register', ({ username, login }, cb) => {
    if (users.find(u => u.login === login)) {
      cb({ success: false, msg: 'Логин уже занят' });
      return;
    }
    users.push({ username, login, socketId: socket.id });
    socket.username = username;
    socket.login = login;
    io.emit('user_list', users.map(u => ({ username: u.username, login: u.login }))); // обновляем список для всех
    cb({ success: true, users: users.map(u => ({ username: u.username, login: u.login })), globalMessages });
    // Добавляем пользователя в глобальный чат
    io.emit('global_message', { user: "System", text: `${username} присоединился к чату`, time: new Date().toLocaleTimeString() });
  });

  // Глобальный чат
  socket.on('global_message', (msg) => {
    const message = { user: socket.username, text: msg, time: new Date().toLocaleTimeString() };
    globalMessages.push(message);
    io.emit('global_message', message);
  });

  // Личные сообщения
  socket.on('private_message', ({ toLogin, text }) => {
    const fromLogin = socket.login;
    const toUser = users.find(u => u.login === toLogin);
    if (!toUser) return;
    const key = [fromLogin, toLogin].sort().join(':');
    if (!privateMessages[key]) privateMessages[key] = [];
    const message = { from: fromLogin, to: toLogin, text, time: new Date().toLocaleTimeString() };
    privateMessages[key].push(message);
    io.to(toUser.socketId).emit('private_message', message);
    socket.emit('private_message', message);
  });

  // Запрос историй ЛС
  socket.on('get_private_history', ({ withLogin }, cb) => {
    const key = [socket.login, withLogin].sort().join(':');
    cb(privateMessages[key] || []);
  });

  // Отключение пользователя
  socket.on('disconnect', () => {
    if (!socket.login) return;
    users = users.filter(u => u.login !== socket.login);
    io.emit('user_list', users.map(u => ({ username: u.username, login: u.login })));
    io.emit('global_message', { user: "System", text: `${socket.username} вышел из чата`, time: new Date().toLocaleTimeString() });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
