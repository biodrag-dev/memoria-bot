import cron from "node-cron";
import client from "./app.js";
import * as submitHelper from "./app/helpers/submitHelper";
import * as embedHelper from "./app/helpers/embedHelper";

import type { ChatInputCommand, CommandData } from "commandkit";

import { ApplicationCommandOptionType } from "discord.js";



export function startScheduler(client: Client) {
  // Every 5 minutes
   embedHelper.updateReservesEmbed(client);
   embedHelper.updateServerRulesEmbed(client);
   embedHelper.updateCharacterRulesEmbed(client);

  cron.schedule("*/30 * * * *", async () => {
    await submitHelper.clearTemporary();
    await submitHelper.clearExpiredReserves();
    await embedHelper.updateReservesEmbed(client);
    // const channel = await client.channels.fetch("1530190433941196902");

    // if (!channel?.isTextBased()) return;

    // await channel.send("test.");
  });
}