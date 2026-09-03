import { EventHandler } from "commandkit";

import * as starboardHelper from "../../helpers/starboardHelper";
import { Message, TextChannel } from "discord.js";

const handler: EventHandler<"messageReactionAdd"> = async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      console.error(err);
      return;
    }
  }

  if (reaction.emoji.name !== "⭐") return;

  if ((reaction.count ?? 0) >= 1) {
    const message = reaction.message;

    const embed = await starboardHelper.getEmbed(message as Message);

    const channel = (await reaction.client.channels.fetch(
      `${process.env.STARBOARD_CHANNEL}`,
    )) as TextChannel;

    await channel.send({
      content: `⭐ **${reaction.count}** ${reaction.message.url}`,
      embeds: [embed],
    });
  }
};

export default handler;
