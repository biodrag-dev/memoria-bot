import type { EventHandler } from "commandkit";
import { Logger } from "commandkit/logger";
import { startScheduler } from "../../../scheduler.js";
import * as embedHelper from "../../helpers/embedHelper";

const handler: EventHandler<"clientReady"> = async (client) => {
  startScheduler(client);
  await embedHelper.updateAllEmbeds(client);
  client.user.setActivity({ name: "Watching over the Archives..." });
  client.user.setStatus("idle");

  Logger.info(`Logged in as ${client.user.username}!`);

};

export default handler;
