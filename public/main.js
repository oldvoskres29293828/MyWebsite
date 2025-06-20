const socket = io();

let currentLogin = null;
let users = [];

document.getElementById('reg-btn').onclick = () => {
  const username = document.getElementById('reg-username').value.trim();
  const login = document.getElementById('reg-login').value.trim();
  if (!username || !login) return;
  socket.emit('register', { username, login }, (res) => {
    if (!res.success) {
      document.getElementById('reg-error').textContent = res.msg;
      return;
    }
    currentLogin = login;
    users = res.users;
    showChat();
    updateUserList(users);
    showGlobalMessages(res.globalMessages);
  });
};

function showChat() {
  document.getElementById('register').style.display = 'none';
  document.getElementById('chat').style.display = '';
}

function updateUserList(userList) {
  const ul = document.getElementById('user-list');
  ul.innerHTML = '';
  const select = document.getElementById('private-to');
  select.innerHTML = '';
  userList.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.username} (${u.login})`;
    if (u.login !== currentLogin) {
      li.onclick = () => {
        document.getElementById('private-tab').click();
        select.value = u.login;
        loadPrivateHistory(u.login);
      };
      select.innerHTML += `<option value="${u.login}">${u.username}</option>`;
    } else {
      li.style.fontWeight = 'bold';
    }
    ul.appendChild(li);
  });
}

socket.on('user_list', updateUserList);

function showGlobalMessages(messages) {
  const box = document.getElementById('global-messages');
  box.innerHTML = '';
  messages.forEach(addGlobalMessage);
}

function addGlobalMessage({ user, text, time }) {
  const box = document.getElementById('global-messages');
  const div = document.createElement('div');
  div.innerHTML = `<b>${user}</b> [${time}]: ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

socket.on('global_message', addGlobalMessage);

document.getElementById('global-send').onclick = () => {
  const input = document.getElementById('global-input');
  if (input.value.trim()) {
    socket.emit('global_message', input.value);
    input.value = '';
  }
};

document.getElementById('global-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('global-send').click();
});

// Tabs
document.getElementById('global-tab').onclick = () => {
  document.getElementById('global-tab').classList.add('active');
  document.getElementById('private-tab').classList.remove('active');
  document.getElementById('global-chat').style.display = '';
  document.getElementById('private-chat').style.display = 'none';
};
document.getElementById('private-tab').onclick = () => {
  document.getElementById('private-tab').classList.add('active');
  document.getElementById('global-tab').classList.remove('active');
  document.getElementById('private-chat').style.display = '';
  document.getElementById('global-chat').style.display = 'none';
  if (document.getElementById('private-to').value)
    loadPrivateHistory(document.getElementById('private-to').value);
};

// Private chat
document.getElementById('private-to').onchange = (e) => {
  loadPrivateHistory(e.target.value);
};

document.getElementById('private-send').onclick = () => {
  const toLogin = document.getElementById('private-to').value;
  const input = document.getElementById('private-input');
  if (toLogin && input.value.trim()) {
    socket.emit('private_message', { toLogin, text: input.value });
    input.value = '';
  }
};

document.getElementById('private-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('private-send').click();
});

function addPrivateMessage({ from, to, text, time }) {
  const box = document.getElementById('private-messages');
  const div = document.createElement('div');
  const you = (from === currentLogin) ? 'Вы' : from;
  div.innerHTML = `<b>${you}</b> [${time}]: ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

socket.on('private_message', (msg) => {
  const toLogin = document.getElementById('private-to').value;
  if (msg.from === toLogin || msg.to === toLogin) {
    addPrivateMessage(msg);
  }
});

function loadPrivateHistory(withLogin) {
  document.getElementById('private-messages').innerHTML = '';
  socket.emit('get_private_history', { withLogin }, (history) => {
    history.forEach(addPrivateMessage);
  });
                                                         }
