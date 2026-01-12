import { Job } from "bullmq";
import { redis } from "./queue";

interface TestJobData {
    payload: string;
}

export const processJob = async (job: Job<TestJobData>) => {
    console.log("[Processor] Job started");

    await new Promise((resolve) =>
        setTimeout(resolve, 1500)
    );

    const logEntry = {
        status: "SUCCESS",
        message: `Processed payload: ${job.data.payload}`,
        timestamp: Date.now(),
    };

    // 🔑 GLOBAL LOG LIST
    await redis.rpush("test:logs", JSON.stringify(logEntry));

    // Optional TTL for safety
    await redis.expire("test:logs", 60 * 60);

    console.log("[Processor] Job completed");
};
