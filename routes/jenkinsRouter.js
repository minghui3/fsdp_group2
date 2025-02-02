require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/job-status', async (req, res) => {
    try {
      const { jobName } = req.query;
      const jenkinsUser = process.env.JENKINS_USER;
      const jenkinsToken = process.env.JENKINS_TOKEN;
  
      const response = await axios.get(`http://localhost:8080/job/${jobName}/lastBuild/api/json`, {
        auth: { username: jenkinsUser, password: jenkinsToken },
      });
  
      const buildStatus = response.data.result; // SUCCESS, FAILURE, or null if still running
      const isBuilding = response.data.building;
      res.json({ status: isBuilding ? "BUILDING" : buildStatus });
  
    } catch (error) {
      console.error("Error fetching Jenkins job status:", error);
      res.status(500).json({ message: "Error fetching build status", error: error.message });
    }
  });
  

// Route to trigger Jenkins pipeline
router.post('/trigger-jenkins', async (req, res) => {
  try {
    const { selectedTestCases } = req.body; // Extract selected test case IDs from request body
    console.log(selectedTestCases);
    if (!selectedTestCases || selectedTestCases.length === 0) {
      return res.status(400).json({ message: 'No test cases selected.' });
    }

    const jenkinsURL = process.env.JENKINS_URL;
    const jenkinsUser = process.env.JENKINS_USER;
    const jenkinsToken = process.env.JENKINS_TOKEN;

    const testCaseParam = selectedTestCases.join(' or ');
    const response = await axios.post(
      jenkinsURL,
      null, // No request body needed for Jenkins API
      {
        params: { SCENARIO_TAGS: testCaseParam }, // Sending test cases as parameters
        auth: { username: jenkinsUser, password: jenkinsToken },
      }
    );

    // Check if the Jenkins request was successful
    if (response.status === 201) {
      return res.json({ message: 'Jenkins job triggered successfully!', testCases: selectedTestCases });
    } else {
      return res.status(500).json({ message: 'Failed to trigger Jenkins job.' });
    }
  } catch (error) {
    console.error('Error triggering Jenkins:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;