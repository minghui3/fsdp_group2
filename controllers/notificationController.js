// controllers/notificationController.js
require('dotenv').config();
const axios = require('axios');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Send Slack Notification
exports.sendSlackNotification = async (message) => {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `🔔 New Notification: \n📢 *Message:* ${message} \n🕒 *Time:* ${new Date().toLocaleString()}`
    });
    console.log("Slack notification sent successfully");
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
};

// Send Email Notification
exports.sendEmailNotification = async (email, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Notification from Your App',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send Telegram Notification
exports.sendTelegramNotification = async (chatId, message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: `🔔 New Notification: \n📢 ${message}`,
    });
    console.log("Telegram notification sent successfully");
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
};

// Send Push Notification (via Firebase Cloud Messaging)
exports.sendPushNotification = async (fcmToken, message) => {
  const payload = {
    notification: {
      title: 'New Notification',
      body: message,
    },
  };

  try {
    await admin.messaging().sendToDevice(fcmToken, payload);
    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};