const fs = require("fs");
const fsPromises = fs.promises;
const { v4: uuidv4 } = require("uuid");
const simpleGit = require("simple-git");

const move = require("../utils/move");
const testCaseSchema = require("../models/testCase");
const { getDBConnection } = require("../database/db");

const FilePath = {
    "java": "src/test/java/stepdefinitions",
    "feature": "src/test/resources/features",
};

const checkFileExists = (projectDir, name) => {
    var path = `${projectDir}/`;

    if (name.endsWith(".java")) {
        path += `${FilePath.java}/${name}`;
    } else if (name.endsWith(".feature")) {
        path += `${FilePath.feature}/${name}`;
    } 
    console.log("Checking path", path); 
    return fs.existsSync(path);
}

const addTestCase = async (req, res) => {
    try {
        if (req.files.length === 0) {
            res.status(204).send("No files received");
        } 

        const projectName = req.projectName || "test-cases";
        const projectDir = `./repos/${projectName}`;
        var files = [];
        
        if (req.override) {
            files = req.files;    
        } else {
            const dupes = [];
            req.files.forEach(f => {
                if (checkFileExists(projectDir, f.originalname)) {
                    dupes.push(f);
                } else {
                    files.push(f);
                }
            });

            if (dupes.length !== 0) {
                res.status(400).json({
                    message: `There are duplicate files.`,
                    files: dupes,
                });
                return;
            }
        }

        const dbConnection = getDBConnection(projectName);
        const TestCase = dbConnection.model("TestCase", testCaseSchema);
        const modelArr = [];

        // Match tags (starts with @) that are above each scenario (starts with Scenario:);
        const regex = /(^\s*@.*\s*)*(^\s*Scenario:\s*.+$)/gm;

        // Process each feature file
        await Promise.all(
            files.map(async (f) => {

                // if is feature file, add uuid, find tags, add to db 
                if (f.originalname.endsWith(".feature")) {
                    const content = await fsPromises.readFile(f.path, 'utf8');
                    const updatedContent = content.replace(regex, (match, tags, scenario) => {
                        tags = tags ? tags.trim() : "";
                        scenario = scenario.trim();
                        const spaces = 4;

                        const uuid = uuidv4();
                        // replace with regex?
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
                            `\n\n${" ".repeat(spaces) + "@" + uuid}`,
                            `${" ".repeat(spaces) + match.trim()}`
                        ].join("\n");
                    });

                    await fsPromises.writeFile(f.path, updatedContent);

                    // move file contents to local copy of repo
                    await move(f.path, `${projectDir}/src/test/resources/features/${f.originalname}`);
                } else if (f.originalname.endsWith(".java")) {
                    await move(f.path, `${projectDir}/src/test/java/stepdefinitions/${f.originalname}`);
                }
            })
        );

        TestCase.bulkSave(modelArr);

        // TODO:
        // clone repo when this project is chosen
        // when switch, delete dir and clone new repo
        // when submit, check if file exists
        // prompt user to override/cancel (checkbox for "Apply for all"?)
        //
        //
        // 1. These shouldn't be hardcoded
        // 2. Handle files overriden by checkout
        // 3. Organise files properly
        // 4. Handle if feature files does not have stepsdefinition
        // 5. Handle files that already exists in repo/Scenarios that already exist in db
        // 6. Handle multiple file submissions at once


        const uploads = simpleGit(projectDir);
        await uploads
            .fetch("origin")
            .checkout("test")
            .add("*")
            .commit(`Add ${files.length} files`)
            .push("origin", "HEAD:refs/heads/test");

        res.status(200).send("Added test cases successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error adding test results");
    } finally {
        await fsPromises.rm(req.dest, { recursive: true });
    }
};

module.exports = { addTestCase };
