const testCaseSchema = require("../models/testCase");
const { getDBConnection } = require("../database/db");

const addTestCase = async (req, res) => {
    try {
        const files = req.files;
        
        if (files.length === 0) {
            res.status(204).send("No files received");
        }
        
        const dbName = req.body.dbName;
        const dbConnection = getDBConnection(dbName);

        // TODO:
        // 1. Go through each file and find scenario
        // 2. Generate and tag uuid for each scenario 
        // 3. Add uuid and other attributes to db
        // 4. After processing all, commit files to git repo
        // 5. Delete files from upload

        res.status(200).send("Added test results successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error adding test results");
    }
};

module.exports = { addTestCase };
