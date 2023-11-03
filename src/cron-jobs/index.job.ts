import { EXAMPLE_JOB_CRON_TIME } from "@/config";
import { logger } from "@utils/logger";
import { exampleJob } from "@/cron-jobs/example.job";

export interface Jobs {
  [key: string]: {
    cronTime: string;
    execute: () => Promise<void>;
  };
}

// Function that executes the cron job only if the previous execution has finished
const executeIfPreviousJobFinished = (job: () => Promise<void>) => {
  let isJobRunning = false;
  return async () => {
    if (isJobRunning) {
      logger.info("Previous job is still running, skipping this execution");
      return;
    }
    isJobRunning = true;
    try {
      await job();
    } catch (e) {
      console.error(e);
    }
    isJobRunning = false;
  };
};

export const CronJobs: Jobs = {
  exampleJob: {
    cronTime: EXAMPLE_JOB_CRON_TIME,
    execute: executeIfPreviousJobFinished(exampleJob),
  },
};
