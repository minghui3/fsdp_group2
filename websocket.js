const { WebSocketServer } = require("ws");

const socketMap = new Map();
const wss = new WebSocketServer({ port: 42069 });

const getWebSocket = (userId) => {
    if (!socketMap.has(userId)) {
        console.log(socketMap);
        throw new Error(`No websocket associated with userId: ${userId}`);
    }
    return socketMap.get(userId);
}

wss.on("connection", (ws, req) => {
    const userId = new URLSearchParams(req.url.split('?')[1]).get("userId");

    if (!userId) {
        return;
    }

    ws.onclose = () => {
        console.log("deleting socket", userId);
        socketMap.delete(userId);
    }

    ws.onerror = (err) => {
        console.log("socket error", err);
    }

    console.log("setting new socket", userId);
    socketMap.set(userId, ws);
});

process.on("SIGINT", async () => {
    console.log("Shutting down websocketserver")
})

console.log(`WSS running on ws://localhost:42069`);


module.exports = getWebSocket;
