import type { EventHandler } from "commandkit";
import * as locationEmbedHelper from "../../helpers/locationEmbedHelper";
import { PermissionFlagsBits } from "discord.js";

const KEYWORD = "m!location";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot || message.webhookId) return;
  if (!message.guild) return;

  if (message.content.trim().startsWith(KEYWORD)) {
    if (!message.member?.permissions?.has(PermissionFlagsBits.Administrator)) {
      return;
    }
    var channel = message.channel;
    const keyword = message.content.replace(KEYWORD, "").trim().split(" ");

    const msg = locationEmbedHelper.embed(keyword[0]!, keyword[1]);

    if (msg.ephemeral) {
      const locEmbed = await message.reply(msg);
      setTimeout(() => {
        locEmbed.delete().catch(() => {});
      }, 3_000);
      return;
    } else if (message.reference) {
      const original = await message.fetchReference();
      original.edit(msg);
      await message.delete().catch(() => {});
    } else {
      const locEmbed = await channel.send(msg);
      const pinMsg = await locEmbed.pin();
      await message.delete().catch(() => {});
    }
  }
};

export default handler;
