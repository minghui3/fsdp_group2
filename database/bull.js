require('dotenv').config();

const Queue = require("bull");
const fsPromises = require("fs").promises;
const processSubmission = require("../jobs/processSubmission");

const projectQueue = new Map();

const getQueue = (projectName) => {
    if (!projectQueue.has(projectName)) {
        const queue = new Queue(projectName, {
            redis: {
                password: process.env.REDIS_PASSWORD,
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            },
        });

        queue.process(processSubmission);

        queue.on("completed", async (job) => {
            console.log(`[ ${projectName} | JOB ${job.id} ] COMPLETED`);
            try {
                await fsPromises.rm(job.data.submissionPath, { recursive: true });
            } catch (err) {
                console.error(err);
            }
        });

        queue.on("failed", async (job) => {
            try {
                if (job.attemptsMade >= job.opts.attempts) {
                    console.log(`[ ${projectName} | JOB ${job.id} ] FAILED`);
                    await fsPromises.rm(job.data.submissionPath, { recursive: true });
                } else {
                    console.log(`[ ${projectName} | JOB ${job.id} ] FAILED BUT WILL RETRY`);
                }
            }
            catch (err) {
                console.error(err);
            }
        })

        projectQueue.set(projectName, queue);
    }
    return projectQueue.get(projectName);
}

module.exports = getQueue;
