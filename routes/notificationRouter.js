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

router.post("/sendCallNotification", async (req, res) => {
    try {
        const { type, to, message } = req.body;
        if (!to) {
            return res.status(400).json({ success: false, message: "Phone number is required!" });
        }

        const result = await notificationController.sendCallNotification(to, message);
        res.status(200).json({ success: true, message: "Notification sent to Call", result });
    } catch (error) {
        console.error("Error sending call notification:", error);
        res.status(500).json({ success: false, message: "Failed to send call notification" });
    }
});

module.exports = router;