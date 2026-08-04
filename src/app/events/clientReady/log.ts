import type { EventHandler } from "commandkit";
import { Logger } from "commandkit/logger";
import { startScheduler } from "../../../scheduler.js";

const handler: EventHandler<"clientReady"> = async (client) => {
  Logger.info(`Logged in as ${client.user.username}!`);
  startScheduler(client);
};

export default handler;
