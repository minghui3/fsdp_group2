// utils/slackService.js
const axios = require('axios');

const sendSlackNotification = async (message) => {
  const webhookURL = 'YOUR_SLACK_WEBHOOK_URL';

  try {
    await axios.post(webhookURL, {
      text: message,
    });
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
};

module.exports = { sendSlackNotification };