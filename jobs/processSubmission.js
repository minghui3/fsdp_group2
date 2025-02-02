const getWebSocket = require("../websocket");
const { v4: uuidv4 } = require("uuid");
const simpleGit = require("simple-git");
const fsPromises = require("fs").promises;

const move = require("../utils/move");
const testCaseSchema = require("../models/testCase");
const { getDBConnection } = require("../database/db");

const FilePath = {
    "java": "src/test/java/stepdefinitions",
    "feature": "src/test/resources/features",
};

const BRANCH = 'test';

const processSubmission = async (job) => {

    const { userId, projectName, files, override } = job.data;

    const logPrefix = `[ ${projectName} | JOB ${job.id} ]`

    console.log(`${logPrefix} START PROCESSING`);

    try {

        const { cool, uncool } = await handleOverride(projectName, files, override);

        console.log(`cool: ${cool.length}`);
        console.log(`uncool: ${uncool.length}`)

        if (uncool.length !== 0) {
            console.log(`${logPrefix} FOUND DUPLICATE FILES`);
            await alertUser(userId, uncool);
        }

        if (cool.length === 0) {
            console.log(`${logPrefix} NO FILES TO PROCESS`);
            return { processed: false };
        }

        const dbConnection = getDBConnection(projectName);
        const TestCase = dbConnection.model("TestCase", testCaseSchema);
        const models = [];

        console.log(`${logPrefix} PROCESSING FILES`);
        await Promise.all(cool.map(async (file) => {
            const name = file.originalname;
            if (name.endsWith(".feature")) {
                const modelArr = await processFeatureFile(file);
                models.push(...modelArr);
            }

            await moveFile(file, projectName);
        }));

        if (models.length !== 0) {
            const temp = models.map(m => new TestCase(m));
            console.log(`${logPrefix} SAVING MODELS`);
            await TestCase.bulkSave(temp);
        }

        console.log(`${logPrefix} DOING GIT STUFF`);
        await commitAndPush(`./repos/${projectName}`, cool.length);

        return { processed: true };
    }
    catch (err) {
        console.error(err);
        // so bull will retry
        throw err;
    }
}

const alertUser = async (userId, files) => {
    try {
        const ws = getWebSocket(userId);
        ws.send(JSON.stringify({
            event: 'duplicate',
            message: "There are duplicate files that were skipped",
            files,
        }));
    }
    catch (err) {
        console.error("Error while alerting user");
        throw err;
    }
}

const processFeatureFile = async (file) => {
    const SCENARIO_REGEX = /(^\s*@.*\s*)*(^\s*Scenario:\s*.+$)/gm;
    const spaces = 4;
    const modelArr = [];

    try {

        const content = await fsPromises.readFile(file.path, 'utf8');
        const updatedContent = content.replace(SCENARIO_REGEX, (match, tags, scenario) => {
            tags = tags ? tags.trim() : "";

            const uuid = uuidv4();
            // replace with regex?
            const name = scenario.trim().replace("Scenario: ", "");
            const filename = file.originalname;
            const tagArr = tags.split(" ").filter(t => t.startsWith("@"));

            // Add each scenario to mongodb
            const model = {
                _id: uuid,
                name: name,
                file: filename,
                tags: tagArr,
            };
            modelArr.push(model);

            // Tag each scenario with an id
            return [
                `\n\n${" ".repeat(spaces) + "@" + uuid}`,
                `${" ".repeat(spaces) + match.trim()}`
            ].join("\n");
        });

        await fsPromises.writeFile(file.path, updatedContent);
        return modelArr;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}


const checkFileExists = async (projectDir, name) => {
    var path = `${projectDir}/`;

    if (name.endsWith(".java")) {
        path += `${FilePath.java}/${name}`;
    } else if (name.endsWith(".feature")) {
        path += `${FilePath.feature}/${name}`;
    }

    return fsPromises.access(path)
        .then(() => true)
        .catch(() => false);
}


const handleOverride = async (projectName, files, override) => {
    if (override) {
        return { cool: files, uncool: [] };
    }
    const projectDir = `./repos/${projectName}`;
    const cool = [];
    const uncool = [];

    const git = simpleGit(projectDir);
    await git
        .fetch('origin')
        .checkout(BRANCH)
        .pull();

    await Promise.all(files.map(async (f) => {
        const exists = await checkFileExists(projectDir, f.originalname);
        if (exists) {
            uncool.push(f);
        } else {
            cool.push(f);
        }
    }));

    return { cool, uncool };
}

const moveFile = async (file, projectName) => {
    let dest = `./repos/${projectName}/`;

    const name = file.originalname;
    if (name.endsWith(".java")) {
        dest += `${FilePath.java}/${name}`;
    } else if (name.endsWith(".feature")) {
        dest += `${FilePath.feature}/${name}`;
    }

    await move(file.path, dest);
}

const commitAndPush = async (projectPath, fileCount) => {
    try {
        const git = simpleGit(projectPath);
        await git
            .fetch("origin")
            .checkout(BRANCH)
            .add("*")
            .commit(`Add ${fileCount} files`)
            .push("origin", `HEAD:refs/heads/${BRANCH}`);
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = processSubmission;