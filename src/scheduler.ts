import cron from "node-cron";
import * as submitHelper from "./app/helpers/submitHelper";
import * as embedHelper from "./app/helpers/embedHelper";
import type { Client } from "commandkit";

export async function startScheduler(client: Client) {
  // Every 5 minutes
  await embedHelper.updateReservesEmbed(client);
  await embedHelper.updateServerRulesEmbed(client);
  await embedHelper.updateCharacterRulesEmbed(client);
  await embedHelper.updateRoleplayRules(client);

  cron.schedule("*/30 * * * *", async () => {
    await submitHelper.clearTemporary();
    await submitHelper.clearExpiredReserves();
    await embedHelper.updateReservesEmbed(client);
    // const channel = await client.channels.fetch("1530190433941196902");

    // if (!channel?.isTextBased()) return;

    // await channel.send("test.");
  });
}
