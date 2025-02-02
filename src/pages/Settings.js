import React, { useState } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import "../style/settings.css";
import { sendNotification } from '../components/NotificationService';

const Settings = () => {
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [emailAlertType, setEmailAlertType] = useState("always");
  const [telegramNotifications, setTelegramNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userTelegramChatId, setUserTelegramChatId] = useState("");
  const [userFCMToken, setUserFCMToken] = useState("");  // For push notifications

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleTelegramChatIdChange = (e) => {
    setUserTelegramChatId(e.target.value);
  };

  const handleFCMTokenChange = (e) => {
    setUserFCMToken(e.target.value);
  };

  const saveEmailSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/setUserEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error saving email:", error);
    }
  };

  const sendNotificationToServer = async (notificationData) => {
    try {
      const response = await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleSlackNotificationChange = () => {
    setSlackNotifications(!slackNotifications);
    if (slackNotifications) {
      sendNotificationToServer({ type: "slack", message: "Test failed!" });
    }
  };

  const handleTelegramNotificationChange = () => {
    setTelegramNotifications(!telegramNotifications);
    if (telegramNotifications && userTelegramChatId) {
      sendNotificationToServer({
        type: "telegram",
        chatId: userTelegramChatId,
        message: "Test failed!",
      });
    }
  };

  const handlePushNotificationChange = () => {
    setPushNotifications(!pushNotifications);
    if (pushNotifications && userFCMToken) {
      sendNotificationToServer({
        type: "push",
        fcmToken: userFCMToken,
        message: "Test failed!",
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <Sidebar />
      <div style={{ marginLeft: "300px" }}>
        <Navbar />
        <div className="settings-container" style={{ padding: "20px" }}>
          <h2>Notification Settings</h2>
          <div className="settings-section">
            <label>
              Slack Notifications
              <input
                type="checkbox"
                checked={slackNotifications}
                onChange={handleSlackNotificationChange}
              />
            </label>

            <div className="settings-section">
              <label>Email for Notifications</label>
              <input
                type="email"
                value={userEmail}
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
              <button onClick={saveEmailSettings}>Save Email</button>
            </div>

            <div className="settings-section">
              <label>Telegram Chat ID</label>
              <input
                type="text"
                value={userTelegramChatId}
                onChange={handleTelegramChatIdChange}
                placeholder="Enter your Telegram Chat ID"
              />
            </div>

            <div className="settings-section">
              <label>FCM Token for Push Notifications</label>
              <input
                type="text"
                value={userFCMToken}
                onChange={handleFCMTokenChange}
                placeholder="Enter your FCM Token"
              />
            </div>

            <label>
              Telegram Notifications
              <input
                type="checkbox"
                checked={telegramNotifications}
                onChange={handleTelegramNotificationChange}
              />
            </label>

            <label>
              Push Notifications
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={handlePushNotificationChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;