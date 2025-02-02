export const sendNotification = async (type, message) => {
    try {
      const response = await fetch('/api/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationType: type, message: message }),
      });
  
      if (response.ok) {
        console.log(`${type} notification sent successfully!`);
      } else {
        console.error('Error sending notification');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };