import cron from "node-cron";
import Cohort from "../models/cohortModel.js";

// will run every day at midnight
export const startCohortAutoCloseJob = () => {
    cron.schedule("0 0 * * *", async () => {
        await Cohort.updateMany(
            {
                isClosed: false,
                closeAt: { $lte: new Date() }
            },
            { $set: { isClosed: true } }
        );
    });
}