const testResultSchema = require("../models/testResult");
const { getDBConnection } = require("../database/db");
const parseTestResult = require("../utils/parseTestResult");

const getAllResults = async (req, res) => {
    try {
        console.log(req.body);
        const dbConnection = getDBConnection(req.body.dbName);

        let result = {};
        const browsers = req.body.browsers;
        await Promise.all(
            browsers.map(async (browser) => {
                browser = browser.toLowerCase();
                const model = dbConnection.model(
                    `test_results_${browser}`,
                    testResultSchema,
                    `test_results_${browser}`
                );
                result[browser] = await model.find({});
            })
        );
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).send("Error fetching test results");
    }
};

const addResult = async (req, res) => {
    try {
        console.log(req.body);

        const browser = req.body.browser;
        const dbName = req.body.dbName;

        const dbConnection = getDBConnection(dbName);
        const model = dbConnection.model(
            `test_results_${browser}`,
            testResultSchema,
            `test_results_${browser}`
        );
        const parsedJSON = parseTestResult(req.body.result);
        const newTestResult = new model(parsedJSON);
        await newTestResult.save();

        res.status(200).send("Added test results successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error adding test results");
    }
};

module.exports = { getAllResults, addResult };
