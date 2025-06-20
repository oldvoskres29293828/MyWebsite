from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json

app = FastAPI()

app.mount("/static", StaticFiles(directory="public"), name="static")
templates = Jinja2Templates(directory="public")

users = {}  # login: {"username": ..., "ws": ...}
public_messages = []

@app.get("/", response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    user = None
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)

            if msg["action"] == "register":
                login = msg["login"]
                username = msg["username"]
                if login in users:
                    await ws.send_text(json.dumps({"action": "register", "success": False, "msg": "Логин занят"}))
                else:
                    users[login] = {"username": username, "ws": ws}
                    user = login
                    await ws.send_text(json.dumps({"action": "register", "success": True, "users": [
                        {"login": k, "username": v["username"]} for k, v in users.items()
                    ], "public_messages": public_messages}))
                    # Уведомить всех о новом пользователе
                    for u in users.values():
                        if u["ws"] != ws:
                            await u["ws"].send_text(json.dumps({"action": "user_list", "users": [
                                {"login": k, "username": v["username"]} for k, v in users.items()
                            ]}))
                    message = {"user": "System", "text": f"{username} присоединился!", "time": ""}
                    public_messages.append(message)
                    for u in users.values():
                        await u["ws"].send_text(json.dumps({"action": "public_message", **message}))

            elif msg["action"] == "public_message":
                message = {"user": users[user]["username"], "text": msg["text"], "time": ""}
                public_messages.append(message)
                for u in users.values():
                    await u["ws"].send_text(json.dumps({"action": "public_message", **message}))

            elif msg["action"] == "private_message":
                to = msg["to"]
                text = msg["text"]
                if to in users:
                    private_msg = {"from": user, "to": to, "text": text, "time": ""}
                    # Отправить обоим участникам
                    await users[to]["ws"].send_text(json.dumps({"action": "private_message", **private_msg}))
                    await ws.send_text(json.dumps({"action": "private_message", **private_msg}))
    except WebSocketDisconnect:
        if user and user in users:
            username = users[user]["username"]
            del users[user]
            # Уведомить всех о выходе пользователя
            for u in users.values():
                await u["ws"].send_text(json.dumps({"action": "user_list", "users": [
                    {"login": k, "username": v["username"]} for k, v in users.items()
                ]}))
            message = {"user": "System", "text": f"{username} вышел из чата", "time": ""}
            public_messages.append(message)
            for u in users.values():
                await u["ws"].send_text(json.dumps({"action": "public_message", **message}))
