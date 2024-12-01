const express = require("express");
const cors = require("cors");
const { closeDBConnections } = require("./database/db");
const dashboardController = require("./controllers/dashboardController");
const testResultController = require("./controllers/testResultController");
const summaryController = require("./controllers/summaryController");
const userRouter = require("./routes/userRouter");
const port = 5000;

const app = express();

app.use(cors()); // Enable Cross-Origin Requests
app.use(express.json()); // Enable JSON parsing in requests
app.use("/", userRouter);

app.get("/api/dashboard-data", dashboardController.getDashboard);
app.get("/api/test-case-summary", summaryController.testCaseSummary);
app.get("/api/recent-activity", testResultController.getAllResults);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
    closeDBConnections();    
    console.log("[server.js] Shutting server down...");
    process.exit(0);
});
