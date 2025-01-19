const express = require("express");
const cors = require("cors");
const { closeDBConnections } = require("./database/db");
const userRouter = require("./routes/userRouter");
const testResultRouter = require("./routes/testResultRouter");
const testCaseRouter = require("./routes/testCaseRouter");
const port = 5000;

const app = express();

app.use(cors()); // Enable Cross-Origin Requests
app.use(express.json()); // Enable JSON parsing in requests
app.use("/", userRouter);
app.use("/api", testResultRouter);
app.use("/api/test-case", testCaseRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
    closeDBConnections();    
    console.log("[server.js] Shutting server down...");
    process.exit(0);
});
