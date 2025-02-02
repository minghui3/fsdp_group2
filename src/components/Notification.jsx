import { useEffect } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "../style/notification.css";

const Notifications = () => {
    const { noti, setNoti, setPopUp } = useWebSocket();

    // Auto-remove notifications after 5 seconds
    useEffect(() => {
        if (noti.length > 0) {
            const timer = setTimeout(() => {
                setNoti((prev) => prev.slice(1));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [noti, setNoti]);

    const getStyles = (event) => {
        switch (event) {
            case "job complete":
                return { className: "success", icon: <FaCheckCircle size={20} /> };
            case "job failed":
                return { className: "error", icon: <FaTimesCircle size={20} /> };
            case "duplicate":
                return { className: "warning", icon: <FaExclamationTriangle size={20} /> };
            default:
                return { className: "info", icon: <FaInfoCircle size={20} /> };
        }
    };

    const handleClick = (notif) => {
        if (notif.event === "duplicate") {
            setPopUp(notif);
        }
    }

    return (
        <div className="notification-container">
            {noti.map((n, i) => {
                const { className, icon } = getStyles(n.event);

                return (
                    <div key={i} className={`notification ${className}`} onClick={() => handleClick(n)}>
                        {icon}
                        <div>
                            {n.message}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Notifications;