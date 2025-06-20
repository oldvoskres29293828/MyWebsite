let ws = null;
let currentLogin = null;
let users = [];

document.getElementById('reg-btn').onclick = () => {
    const username = document.getElementById('reg-username').value.trim();
    const login = document.getElementById('reg-login').value.trim();
    if (!username || !login) return;
    ws = new WebSocket(getWsUrl());
    ws.onopen = () => {
        ws.send(JSON.stringify({action: "register", username, login}));
    };
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.action === "register") {
            if (!msg.success) {
                document.getElementById('reg-error').textContent = msg.msg;
                ws.close();
                return;
            }
            currentLogin = login;
            users = msg.users;
            showChat();
            updateUserList(users);
            showGlobalMessages(msg.public_messages);
        } else if (msg.action === "user_list") {
            updateUserList(msg.users);
        } else if (msg.action === "public_message") {
            addGlobalMessage(msg);
        } else if (msg.action === "private_message") {
            handlePrivateMessage(msg);
        }
    };
    ws.onclose = () => {
        if (!currentLogin) {
            document.getElementById('reg-error').textContent = "Нет соединения с сервером.";
        }
    };
};

function getWsUrl() {
    let loc = window.location;
    let wsStart = (loc.protocol === "https:") ? "wss://" : "ws://";
    return wsStart + loc.host + "/ws";
}

function showChat() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('chat').style.display = '';
}

function updateUserList(userList) {
    users = userList;
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
                clearPrivateMessages();
            };
            select.innerHTML += `<option value="${u.login}">${u.username}</option>`;
        } else {
            li.style.fontWeight = 'bold';
        }
        ul.appendChild(li);
    });
}

function showGlobalMessages(messages) {
    const box = document.getElementById('global-messages');
    box.innerHTML = '';
    messages.forEach(addGlobalMessage);
}

function addGlobalMessage({user, text, time}) {
    const box = document.getElementById('global-messages');
    const div = document.createElement('div');
    div.innerHTML = `<b>${user}</b> [${time || ""}]: ${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

document.getElementById('global-send').onclick = () => {
    const input = document.getElementById('global-input');
    if (input.value.trim()) {
        ws.send(JSON.stringify({action: "public_message", text: input.value}));
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
        clearPrivateMessages();
};

document.getElementById('private-to').onchange = () => {
    clearPrivateMessages();
};

document.getElementById('private-send').onclick = () => {
    const toLogin = document.getElementById('private-to').value;
    const input = document.getElementById('private-input');
    if (toLogin && input.value.trim()) {
        ws.send(JSON.stringify({action: "private_message", to: toLogin, text: input.value}));
        input.value = '';
    }
};

document.getElementById('private-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('private-send').click();
});

function handlePrivateMessage({from, to, text, time}) {
    const toLogin = document.getElementById('private-to').value;
    if (from === toLogin || to === toLogin) {
        addPrivateMessage({from, text, time});
    }
}

function addPrivateMessage({from, text, time}) {
    const box = document.getElementById('private-messages');
    const you = (from === currentLogin) ? 'Вы' : from;
    const div = document.createElement('div');
    div.innerHTML = `<b>${you}</b> [${time || ""}]: ${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function clearPrivateMessages() {
    document.getElementById('private-messages').innerHTML = '';
                                }
