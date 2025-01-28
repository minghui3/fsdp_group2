const fsPromises = require("fs").promises;
const getQueue = require("../database/bull");

const checkRepoExists = async (projectName) => {
    return fsPromises.access(`./repos/${projectName}`)
        .then(() => true)
        .catch(() => false);
}


const addTestCase = async (req, res) => {
    try {
        const { projectName } = req.body;
        const files = req.files;
        const override = req.body.override || false;
        const submissionPath = req.dest;
        console.log("[NEW SUBMISSION]");
        console.log(`Project Name: ${projectName}\nFiles: ${files}\nOverride: ${override}\nSubmission Path: ${submissionPath}`);

        if (!files || files.length === 0) {
            res.status(204).send("No files received");
            return;
        } 

        if (!checkRepoExists(projectName)) {
            res.status(404).send(`Project ${projectName} not found`);
            return;
        }

        const queue = getQueue(projectName);
        await queue.add({ projectName, files, override, submissionPath });

        res.status(200).send("Job has been added to add test cases");
    } 
    catch (err) {
        console.error(err);
        res.status(400).send("Failed to add job to add test cases");
    } 
};

module.exports = { addTestCase };
