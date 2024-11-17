// server.js
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const { connection }= require('./database/db');
const dashboardController = require('./controllers/dashboardController')
const testResultController = require('./controllers/testResultController');
const summaryController = require('./controllers/summaryController');
const port = 5000;
const { cache } = require('./cache');
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Requests
app.use(express.json()); // Enable JSON parsing in requests

connection();
// Dummy user data
const users = [
    { username: 'user', password: 'password' }
  ];

// Dummy login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Dummy data for the Dashboard
app.get('/api/dashboard-data', dashboardController.getDashboard);

// API Route to return the static test case summary
app.get('/api/test-case-summary', summaryController.testCaseSummary);
  // In your backend (server.js or routes file)
app.get('/api/recent-activity', testResultController.getAllResults);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});