import cron from "node-cron";
import * as submitHelper from "./app/helpers/submitHelper";
import * as embedHelper from "./app/helpers/embedHelper";
import type {Client} from "commandkit";

export async function startScheduler(client: Client) {
   await embedHelper.updateAllEmbeds(client);
   
    //every 30 minutes
   cron.schedule("*/30 * * * *", async () => {
    await submitHelper.clearTemporary();
    await submitHelper.clearExpiredReserves();
    await embedHelper.updateReservesEmbed(client);
    // const channel = await client.channels.fetch("1530190433941196902");

    // if (!channel?.isTextBased()) return;

    // await channel.send("test.");
  });
}