import cron from "node-cron";
import client from "./app.js";
import * as submitHelper from "./app/helpers/submitHelper";

export function startScheduler() {
  cron.schedule("*/30 * * * *", async () => {
    await submitHelper.clearTemporary();
    await submitHelper.clearExpiredReserves();
  });
}
