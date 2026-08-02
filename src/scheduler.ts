import cron from "node-cron";
import client from "./app.js";
import * as submitHelper from "./app/helpers/submitHelper";
import type { ChatInputCommand, CommandData } from "commandkit";

import { ApplicationCommandOptionType } from "discord.js";



export function startScheduler(client: Client) {
  // Every 5 minutes
  cron.schedule("*/1 * * * *", async () => {
    await submitHelper.clearTemporary();
    await submitHelper.clearExpiredReserves();

    const channel = await client.channels.fetch("1530190433941196902");

    if (!channel?.isTextBased()) return;

    await channel.send("test.");
  });
}