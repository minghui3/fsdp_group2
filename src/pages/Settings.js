import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import "../style/settings.css";

const Settings = () => {
    
  // Initial state values based on localStorage
  const [slackNotifications, setSlackNotifications] = useState(
    JSON.parse(localStorage.getItem("slackNotifications")) || false
  );
  const [telegramNotifications, setTelegramNotifications] = useState(
    JSON.parse(localStorage.getItem("telegramNotifications")) || false
  );
  const [pushNotifications, setPushNotifications] = useState(
    JSON.parse(localStorage.getItem("pushNotifications")) || false
  );
  const [smsNotifications, setSmsNotifications] = useState(
    JSON.parse(localStorage.getItem("smsNotifications")) || false
  );
  const [phoneCallNotifications, setPhoneCallNotifications] = useState(
    JSON.parse(localStorage.getItem("phoneCallNotifications")) || false
  );
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [userTelegramChatId, setUserTelegramChatId] = useState(localStorage.getItem("userTelegramChatId") || "");
  const [userFCMToken, setUserFCMToken] = useState(localStorage.getItem("userFCMToken") || "");
  const [userPhoneNumber, setUserPhoneNumber] = useState(localStorage.getItem("userPhoneNumber") || "");
  const [emailNotifications, setEmailNotifications] = useState(
    JSON.parse(localStorage.getItem("emailNotifications")) || false
  );

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Save preferences to localStorage whenever any of the states change
  useEffect(() => {
    localStorage.setItem("slackNotifications", JSON.stringify(slackNotifications));
    localStorage.setItem("telegramNotifications", JSON.stringify(telegramNotifications));
    localStorage.setItem("phoneCallNotifications", JSON.stringify(phoneCallNotifications));
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userTelegramChatId", userTelegramChatId);
    localStorage.setItem("userPhoneNumber", userPhoneNumber);
    localStorage.setItem("emailNotifications", JSON.stringify(emailNotifications));
  }, [
    slackNotifications,
    telegramNotifications,
    phoneCallNotifications,
    userEmail,
    userTelegramChatId,
    userPhoneNumber,
    emailNotifications,
  ]);

  const sendNotificationToServer = async (type) => {
    try {
      let url = '';
      let body = {};

      // Determine the API endpoint and request body based on notification type
      switch (type) {
        case 'slack':
          url = "http://localhost:5000/api/sendSlackNotification";
          body = { message: "Test failed!" };
          break;
        case 'email':
          url = "http://localhost:5000/api/sendEmailNotification";
          body = { email: userEmail, message: "Test failed!" };
          break;
        case 'telegram':
          url = "http://localhost:5000/api/sendTelegramNotification";
          body = { chatId: userTelegramChatId, message: "Test failed!" };
          break;
        case 'call':
          url = "http://localhost:5000/api/sendCallNotification";
          body = { to: userPhoneNumber, message: "Test failed!" };
          break;
        default:
          throw new Error("Invalid notification type");
      }

      // Make the POST request to the backend
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Show the success message
      } else {
        console.error(result);
        alert("Failed to send notification!");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred while sending the notification");
    }
  };

  const handleSave = async () => {
    try {
      alert("Settings saved successfully!");

      // Send notifications based on selected preferences
      if (slackNotifications) {
        await sendNotificationToServer("slack");
      }
      if (emailNotifications && userEmail) {
        await sendNotificationToServer("email");
      }
      if (telegramNotifications && userTelegramChatId) {
        await sendNotificationToServer("telegram");
      }
      if (phoneCallNotifications && userPhoneNumber) {
        await sendNotificationToServer("call");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <Sidebar />
      <div style={{ marginLeft: "300px" }}>
        <Navbar />
        <div className="settings-container" style={containerStyle}>
          <h2 style={headingStyle}>Notification Settings</h2>

          {/* Slack Notifications */}
          <div style={settingItemStyle}>
            <div style={checkboxContainerStyle}>
              <input
                type="checkbox"
                checked={slackNotifications}
                onChange={() => setSlackNotifications(!slackNotifications)}
                style={checkboxStyle}
              />
              <label style={labelStyle}>Slack Notifications</label>
            </div>
          </div>

          {/* Email Notifications */}
          <div style={settingItemStyle}>
            <div style={checkboxContainerStyle}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                style={checkboxStyle}
              />
              <label style={labelStyle}>Email Notifications</label>
            </div>
          </div>

          <div className="settings-section" style={settingItemStyle}>
            <label style={labelStyle}>Email for Notifications</label>
            <input
              type="email"
              value={userEmail}
              onChange={handleInputChange(setUserEmail)}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          {/* Telegram Notifications */}
          <div style={settingItemStyle}>
            <div style={checkboxContainerStyle}>
              <input
                type="checkbox"
                checked={telegramNotifications}
                onChange={() => setTelegramNotifications(!telegramNotifications)}
                style={checkboxStyle}
              />
              <label style={labelStyle}>Telegram Notifications</label>
            </div>
          </div>

          <div style={settingItemStyle}>
            <label style={labelStyle}>Telegram Chat ID</label>
            <input
              type="text"
              value={userTelegramChatId}
              onChange={handleInputChange(setUserTelegramChatId)}
              placeholder="Enter your Telegram Chat ID"
              style={inputStyle}
            />
          </div>

          {/* Phone Notifications (SMS & Call) */}
          <div style={settingItemStyle}>
            <div style={checkboxContainerStyle}>
              <input
                type="checkbox"
                checked={phoneCallNotifications}
                onChange={() => setPhoneCallNotifications(!phoneCallNotifications)}
                style={checkboxStyle}
              />
              <label style={labelStyle}>Phone Call Notifications</label>
            </div>
          </div>

          <div style={settingItemStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              value={userPhoneNumber}
              onChange={handleInputChange(setUserPhoneNumber)}
              placeholder="Enter your phone number"
              style={inputStyle}
            />
          </div>

          {/* Save Button */}
          <div style={saveButtonContainer}>
            <button onClick={handleSave} style={saveButtonStyle}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: "30px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  margin: "30px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const settingItemStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  fontSize: "16px",
  marginBottom: "8px",
  display: "block",
};

const inputStyle = {
  padding: "10px",
  width: "95%",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "10px",
};

const checkboxStyle = {
  marginTop: "10px",
  width: "20px",
  height: "20px",
};

const checkboxContainerStyle = {
  display: "flex",
  alignItems: "center",
};

const saveButtonContainer = {
  textAlign: "center",
  marginTop: "30px",
};

const saveButtonStyle = {
  padding: "12px 24px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
};

export default Settings;
