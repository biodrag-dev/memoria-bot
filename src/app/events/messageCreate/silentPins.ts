import type { EventHandler } from "commandkit";
import { EmbedBuilder } from "discord.js";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (!message.guild) return;
  if (message.author.id == `${process.env.CLIENT_ID}` && message.type == 6) {
    message.delete();
  }
};

export default handler;
