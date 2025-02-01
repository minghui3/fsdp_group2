import { createContext, useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ userId }) => {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const newWs = new WebSocket(`ws://localhost:42069?userId=${userId}`);

        newWs.onopen = () => {
            console.log(`User ${userId} connected`);
        };

        newWs.onclose = () => {
            console.log(`User ${userId} disconnected`);
        };

        newWs.onerror = (err) => {
            console.log("Websocket error: ", err);
        };

        newWs.onmessage = (msg) => {
            const message = JSON.parse(msg.data);
            console.log(message);
        };

        setWs(newWs)

        return () => {
            newWs.close();
        }
    }, [userId]);

    return (
        <WebSocketContext.Provider value={ws}>
            <Outlet />
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
