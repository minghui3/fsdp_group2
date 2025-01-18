const fs = require("fs");
const fsPromises = fs.promises;
const { v4: uuidv4 } = require("uuid");
const simpleGit = require("simple-git");

const testCaseSchema = require("../models/testCase");
const { getDBConnection } = require("../database/db");

const addTestCase = async (req, res) => {
    try {
        const files = req.files;

        if (files.length === 0) {
            res.status(204).send("No files received");
        }

        const repoUrl = req.body.repoUrl || "https://github.com/minghui3/test-cases.git";
        const dbname = req.body.dbname || "PulsePointHR";
        const dbConnection = getDBConnection(dbname);
        const TestCase = dbConnection.model("TestCase", testCaseSchema);
        const modelArr = [];

        // Match tags (starts with @) that are above each scenario (starts with Scenario:);
        const regex = /(^\s*@.*\s*)*(^\s*Scenario:\s*.+$)/gm;

        // Process each feature file
        await Promise.all(
            files
                .filter(a => a.originalname.endsWith(".feature"))
                .map(async (f) => {
                    const content = await fsPromises.readFile(f.path, 'utf8');
                    const updatedContent = content.replace(regex, (match, tags, scenario) => {
                        tags = tags ? tags.trim() : "";
                        scenario = scenario.trim();
                        const spaces = 4;

                        const uuid = uuidv4();
                        const name = scenario.replace("Scenario: ", "");
                        const file = f.originalname;
                        const tagArr = tags.split(" ").filter(t => t.startsWith("@"));

                        // Add each scenario to mongodb
                        const model = new TestCase({
                            _id: uuid,
                            name: name,
                            file: file,
                            tags: tagArr,
                        })
                        modelArr.push(model);

                        // Tag each scenario with an id
                        return [
                            `\n${" ".repeat(spaces) + "@" + uuid}`,
                            `${" ".repeat(spaces) + match.trim()}`
                        ].join("\n");
                    });

                    // update file contents
                    await fsPromises.writeFile('./uploads/' + f.originalname, updatedContent);
                })
        );

        TestCase.bulkSave(modelArr);

        // TODO:
        // 1. These shouldn't be hardcoded
        // 2. Handle files overriden by checkout
        // 3. Organise files properly
        // 4. Handle if feature files does not have stepsdefinition
        // 5. Handle files that already exists in repo/Scenarios that already exist in db
        // 6. Handle multiple file submissions at once


        const uploads = simpleGit("./uploads");
        await uploads
            .init()
            .addRemote("origin", repoUrl)
            .fetch("origin")
            .checkout("expensivehippo")
            .add("*")
            .commit(`Add ${files.length} files`)
            .push("origin", "HEAD:refs/heads/expensivehippo");

        res.status(200).send("Added test cases successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error adding test results");
    } finally {
        await fsPromises.rm("./uploads", { recursive: true });
    }
};

module.exports = { addTestCase };
