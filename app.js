const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

const port = process.env.PORT || 3001;

// 显示聊天页面
app.get("/", (req, res) => {
    res.type("html").send(html);
});

// WebSocket连接
app.ws("/ws", (ws, req) => {
    console.log("有用户连接");

    ws.on("message", (message) => {
        console.log("收到消息：" + message);

        // 把消息发送给所有已连接的用户
        expressWs.getWss().clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("有用户断开连接");
    });
});

app.listen(port, () => {
    console.log(`服务器已启动：http://localhost:${port}`);
});

const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>WebSocketチャット</title>
</head>
<body>
    <h1>WebSocketチャット</h1>

    <input id="message" type="text" placeholder="メッセージを入力">
    <button onclick="sendMessage()">送信</button>

    <ul id="messages"></ul>

    <script>
        const protocol =
            location.protocol === "https:" ? "wss" : "ws";

        const socket = new WebSocket(
            protocol + "://" + location.host + "/ws"
        );

        socket.onopen = () => {
            console.log("WebSocketに接続しました");
        };

        socket.onmessage = (event) => {
            const li = document.createElement("li");
            li.textContent = event.data;
            document.getElementById("messages").appendChild(li);
        };

        function sendMessage() {
            const input = document.getElementById("message");

            if (input.value !== "") {
                socket.send(input.value);
                input.value = "";
            }
        }
    </script>
</body>
</html>
`;
