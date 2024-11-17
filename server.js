// server.js
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const { connection }= require('./database/db');
const dashboardController = require('./controllers/dashboardController')
const testResultController = require('./controllers/testResultController');
const summaryController = require('./controllers/summaryController');
const userRouter = require('./routes/userRouter');
const port = 5000;
const { cache } = require('./cache');
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Requests
app.use(express.json()); // Enable JSON parsing in requests
app.use('/', userRouter);

connection();

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

process.on("SIGINT", async () => {
    console.log("[SERVER] Shutting server down...");
    process.exit(0);
})