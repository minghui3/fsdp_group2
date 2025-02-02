const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/sendSlackNotification", (req, res) => {
    notificationController.sendSlackNotification(req.body.message);
    res.status(200).json({ success: true, message: "Notification sent to Slack" });
});

router.post("/sendEmailNotification", (req, res) => {
    notificationController.sendEmailNotification(req.body.email, req.body.message);
    res.status(200).json({ success: true, message: "Notification sent to Email" });
});

router.post("/sendTelegramNotification", (req, res) => {
    notificationController.sendTelegramNotification(req.body.chatId, req.body.message);
    res.status(200).json({ success: true, message: "Notification sent to Telegram" });
});

router.post("/sendPushNotification", (req, res) => {
    notificationController.sendPushNotification(req.body.fcmToken, req.body.message);
    res.status(200).json({ success: true, message: "Notification sent to Push" });
});

module.exports = router;