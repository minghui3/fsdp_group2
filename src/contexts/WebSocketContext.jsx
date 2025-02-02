import { createContext, useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Notification from "../components/Notification";
import PopUp from "../components/PopUp";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ userId }) => {
    const [ws, setWs] = useState(null);
    const [noti, setNoti] = useState([]);
    const [popUp, setPopUp] = useState(null);

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
            const { event, message, files } = JSON.parse(msg.data);
            switch (event) {
                case "job complete":
                case "job failed":
                    setNoti((prev) => [...prev, { event, message }]);
                    break;
                case "duplicate":
                    setNoti((prev) => [...prev, { event, message, files }]);
                    break;
                default:
                    return;
            };
        };

        setWs(newWs);

        return () => {
            if (newWs.readyState === 1) {
                newWs.close();
            }
        }
    }, [userId]);

    return (
        <WebSocketContext.Provider value={{ ws, noti, setNoti, popUp, setPopUp }}>
            <Notification />
            <PopUp />
            <Outlet />
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
