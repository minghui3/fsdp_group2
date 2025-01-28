const { run, runAndStream } = require("../utils/run");

const runRedis = async () => {
    try {
        const redisRunning = await run("docker", "ps -q --filter name=redis-container".split(" "));

        if (!redisRunning) {
            const redisExists = await run("docker", "ps -qa --filter name=redis-container".split(" "));

            if (redisExists) {
                await run("docker", "start redis-container".split(" "))
            } else {
                await run("docker", "run -d --name redis-container -p 6739:6739 fsdp:redis".split(" "));
            }
        }
    }
    catch (err) {
        console.error("Error starting redis: ", err);
        throw err;
    }
}

const initRepos = async () => {
    try {
        await run("node", ["./init/repo.js"]);
    }
    catch (err) {
        console.error("Error initialising repos: ", err);
        throw err;
    }
}

const startServer = async () => {
    try {
        console.log("start");
        await runAndStream("node", ["server.js"]);
        console.log("end");
    }
    catch (err) {
        console.error("Error starting server: ", err);
        throw err;
    }
}

(async () => {
    try {
        await runRedis();
        await initRepos();
        await startServer();
    }
    catch (err) {
        console.error(`Startup failed`);
        process.exit(1);
    }
})();
