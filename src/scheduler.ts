import cron from "node-cron";
import * as submitHelper from "./app/helpers/submitHelper";
import * as embedHelper from "./app/helpers/embedHelper";
import * as characterHelper from "./app/helpers/characterHelper";

import type { Client } from "commandkit";

export async function startScheduler(client: Client) {
  // Every 5 minutes

  cron.schedule("*/30 * * * *", async () => {
    await submitHelper.clearTemporary();
    await submitHelper.clearExpiredReserves();
    await embedHelper.updateReservesEmbed(client);
    // const channel = await client.channels.fetch("1530190433941196902");

    // if (!channel?.isTextBased()) return;

    // await channel.send("test.");
  });

  cron.schedule("*/1 * * * *", async () => {
    const date = new Date();
    const bdays = await characterHelper.getOOCBirthdays(date.getMonth(), date.getDate());
    for(const id of bdays){
      await embedHelper.sendOOCBirthdayEmbed(client, id);
    }
    console.log("Bdays: ", bdays)
  });
}
