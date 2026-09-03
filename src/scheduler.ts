import cron from "node-cron";
import * as submitHelper from "./app/helpers/extraHelpers/submitHelper";
import * as embedHelper from "./app/helpers/embedHelper";
import * as characterHelper from "./app/helpers/characterHelper";
import * as birthdayHelper from "./app/helpers/extraHelpers/birthdayHelper";

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

  //
  cron.schedule("0 0 * * *", async () => {
    const date = new Date();
    const bdays = await birthdayHelper.getOOCBirthdays(
      date.getMonth(),
      date.getDate(),
    );
    for (const id of bdays) {
      await embedHelper.sendOOCBirthdayEmbed(client, id);
    }
    const charaBdays = await birthdayHelper.getCharaBdays(
      date.getMonth(),
      date.getDate(),
    );
    for (const id of charaBdays) {
      await embedHelper.sendCharaBdayEmbed(
        client,
        id.charaName,
        id.userId,
        undefined,
        undefined,
      );
    }
  });
}
