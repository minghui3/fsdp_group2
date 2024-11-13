// server.js
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const port = 5000;

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Requests
app.use(express.json()); // Enable JSON parsing in requests

// Dummy user data
const users = [
    { username: 'user', password: 'password' }
  ];
  
// Dummy login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Dummy data for the Dashboard
app.get('/api/dashboard-data', (req, res) => {

    // Generate the last 10 days as labels
    const dateForLast10Days = Array.from({ length: 10 }, (_, i) =>
        moment().subtract(9 - i, 'days').format('YYYY-MM-DD') // Adjust format as needed
    );

    // Generate the last 7 days as labels
    const dateForLast7Days = Array.from({ length: 7 }, (_, i) =>
        moment().subtract(6 - i, 'days').format('YYYY-MM-DD') // Adjust format as needed
    );

    const dummyData = {
      // Test Outcome 
      doughnut: { passCount: 80, failCount: 20 },

      // Test Outcome Over the Last 10 Days
      lineGraph: {
        dateForLast10Days,
        passCount: [50, 60, 55, 70, 65, 80, 75, 90, 85, 100], // Example pass data
        failCount: [5, 10, 8, 7, 15, 9, 14, 12, 10, 8], // Example fail data
      },

      // Automation Coverage for last 7 days
      autoCoverage: {
        dateForLast7Days,
        autoTests: [70, 75, 80, 85, 78, 82, 90], // Automated test coverage
        manualTests: [30, 25, 20, 15, 22, 18, 10] // Manual test coverage (optional)
      },

      // Test Runs for Monthly Comparison
      testRunComparison: {
        labels: ['Test 1', 'Test 2', 'Test 3'],
        data: [80, 85, 75],
      },

      // Top Failing Tests
      topFailingTests: [
        { testName: 'Network Issue', failures: 50, total: 100 },
        { testName: 'Code Defects', failures: 30, total: 110 },
        { testName: 'Environment Inconsistencies', failures: 20, total: 102 },
      ],

      // Browser Coverage
      browserCoverage: {
        browsers: ['Chrome', 'Firefox', 'Edge'],
        coverage: [90, 85, 80],
      },
    };
  
    res.json(dummyData);
  });

// API Route to return the static test case summary
app.get('/api/test-case-summary', (req, res) => {
    const testCaseData = {
      totalTestCase: {
        total: 190,
        passed: 150,
        failed: 50
      },
      currentMonth: {
        total: 100,
        passed: 80,
        failed: 20
      },
      lastMonth: {
        total: 90,
        passed: 70,
        failed: 30
      }
    };
  
    // Send the data as JSON
    res.json(testCaseData);
  });

  // In your backend (server.js or routes file)
app.get('/api/recent-activity', (req, res) => {
    const recentActivities = [
      { id: 1089, name: 'Load Account Balance Information', executedBy: 'Jerome', date: '2023-11-07', result: 'Passed' },
      { id: 1088, name: 'Display Alerts for Unusaual Activity', executedBy: 'Mathryn', date: '2023-11-06', result: 'Failed' },
      { id: 1087, name: 'Cancel Pending Payment', executedBy: 'Jacob', date: '2023-11-05', result: 'Passed' },
      { id: 1086, name: 'Load Account Balance Information', executedBy: 'Jerome', date: '2023-11-07', result: 'Passed' },
      { id: 1085, name: 'Display Alerts for Unusaual Activity', executedBy: 'Mathryn', date: '2023-11-06', result: 'Failed' },
      { id: 1084, name: 'Cancel Pending Payment', executedBy: 'Jacob', date: '2023-11-05', result: 'Passed' },
      // Add more mock activities as needed
    ];
    res.json(recentActivities);
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});