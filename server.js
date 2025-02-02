// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { closeDBConnections } = require("./database/db");
const { closeQueues } = require("./database/bull");
const { run } = require("./utils/run");
const userRouter = require("./routes/userRouter");
const testResultRouter = require("./routes/testResultRouter");
const testCaseRouter = require("./routes/testCaseRouter");
const notificationRouter = require('./routes/notificationRouter');
const port = 5000;
const app = express();

app.use(cors()); // Enable Cross-Origin Requests
app.use(express.json()); // Enable JSON parsing in requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", userRouter);
app.use("/api", testResultRouter);
app.use("/api/test-case", testCaseRouter);
app.use('/api', notificationRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
    try {
        await closeDBConnections();
        await closeQueues();
        console.log("Shutting server down...");
        await run("docker", "stop redis-container".split(" "));
        console.log("Stopping docker container...");
        process.exit(0);
    }
    catch (err) {
        console.error("Did not gracefully shut down: ", err);
        process.exit(1);
    }
});
