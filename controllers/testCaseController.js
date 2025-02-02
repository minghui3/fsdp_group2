const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { getQueue } = require("../database/bull");

const checkRepoExists = async (projectName) => {
    return fsPromises.access(`./repos/${projectName}`)
        .then(() => true)
        .catch(() => false);
}
const getTestCases = async (req, res) => {
    try {
        const repoPath = path.join(__dirname, '..', 'repos','test-cases', 'src','test', 'resources', 'features');
        const files = await fsPromises.readdir(repoPath);
        const testCases = [];

        // Regular expression to match ID tags (UUID format)
        const idTagPattern = /@[a-f0-9\-]{36}/i; 

        // Loop through each file in the directory
        for (const file of files) {
            if (file.endsWith('.feature')) {
                const filePath = path.join(repoPath, file);
                const fileContent = await fsPromises.readFile(filePath, 'utf-8');

                const scenarioPattern = /(@[a-zA-Z0-9\-]+(?:\s+@[a-zA-Z0-9\-]+)*)?\s*Scenario:\s*(.*)/gm;
                let match;
                while ((match = scenarioPattern.exec(fileContent)) !== null) {
                    const allTags = match[1].split(/\s+/);  // Split tags by spaces
                    const idTags = allTags.filter(tag => idTagPattern.test(tag));
                    if (idTags.length > 0) {
                        const scenarioName = match[2].trim();
                        testCases.push({ scenarioName, tags: idTags });
                    }
                }
            }
        }

        // Send the result as JSON
        return res.json(testCases);
    } catch (error) {
        console.error('Error fetching test cases:', error);
        return res.status(500).json({ error: 'Failed to fetch test cases' });
    }
};
    

const addTestCase = async (req, res) => {
    try {
        const { projectName, userId } = req.body;
        const override = req.body.override === "false" ? false : true;
        const files = req.files;
        const submissionPath = req.dest;

        console.log("[NEW SUBMISSION]");
        console.log(`Project Name: ${projectName}\nUser ID: ${userId}\nFiles: ${files}\nOverride: ${override}\nSubmission Path: ${submissionPath}`);

        if (!projectName) {
            res.status(400).send(`Missing project name`);
            return;
        }

        if (!userId) {
            res.status(400).send(`Missing user id`);
            return;
        }

        if (!files || files.length === 0) {
            res.status(204).send("No files received");
            return;
        }

        if (!checkRepoExists(projectName)) {
            res.status(404).send(`Project ${projectName} not found`);
            return;
        }

        const queue = getQueue(projectName);
        await queue.add({ projectName, userId, override, files, submissionPath });
        res.status(200).send("Job has been added");
    }
    catch (err) {
        console.error(err);
        res.status(400).send("Failed to add job to add test cases");
    }
};

module.exports = { getTestCases, addTestCase };
