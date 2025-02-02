require('dotenv').config();

const Queue = require("bull");
const fsPromises = require("fs").promises;
const processSubmission = require("../jobs/processSubmission");
const getWebSocket = require("../websocket");

const projectQueue = new Map();

const getQueue = (projectName) => {
    if (!projectQueue.has(projectName)) {
        const queue = new Queue(projectName, {
            redis: {
                password: process.env.REDIS_PASSWORD,
            },
            defaultJobOptions: {
                attempts: 1,
            },
        });

        queue.on("error", async (err) => {
            const a = await queue.getJobCounts();
            console.log(a);
            console.error(err);
        });

        queue.process(processSubmission);

        queue.on("completed", async (job, result) => {
            console.log(`[ ${projectName} | JOB ${job.id} ] COMPLETED`);
            try {
                const { userId } = job.data;
                const { processed } = result || { processed: false };

                if (processed) {
                    const ws = getWebSocket(userId);
                    ws.send(JSON.stringify({
                        event: "job complete",
                        message: "File(s) uploaded successfully"
                    }));
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                await fsPromises.rm(job.data.submissionPath, { recursive: true });
            }
        });

        queue.on("failed", async (job) => {
            try {
                if (job.attemptsMade >= job.opts.attempts) {
                    console.log(`[ ${projectName} | JOB ${job.id} ] FAILED`);

                    const { userId } = job.data;
                    const ws = getWebSocket(userId);

                    ws.send(JSON.stringify({
                        event: "job failed",
                        message: "Failed to upload files"
                    }));
                }
                else {
                    console.log(`[ ${projectName} | JOB ${job.id} ] FAILED BUT WILL RETRY`);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                if (job.attemptsMade >= job.opts.attempts) {
                    await fsPromises.rm(job.data.submissionPath, { recursive: true });
                }
            }
        })

        projectQueue.set(projectName, queue);
    }
    return projectQueue.get(projectName);
}

const closeQueues = async () => {
    console.log("[bull.js] Closing queues");
    try {

        await Promise.all(Object.values(projectQueue).map(queue => queue.close()));
    } catch (err) {
        console.log(`bluh`);
        console.error(err);
    }
}

module.exports = { getQueue, closeQueues };
