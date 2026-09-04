import type { EventHandler } from "commandkit";
import { EmbedBuilder, TextChannel } from "discord.js";
import * as proxyHelper from "../../helpers/proxyHelper";

const handler: EventHandler<"messageDelete"> = async (message) => {
  if (message.author?.bot) return;
  if (!message.author) return;

  if(proxyHelper.deleteCheckProxyLog(message.id)){
    return;
  }


  const channel = (await message.client.channels.fetch(
    `${process.env.MESSAGE_LOG}`,
  )) as TextChannel;

  const attachments = message.attachments.size
    ? [...message.attachments.values()]
        .map((attachment) => attachment.url)
        .join("\n")
    : "*None*";

  const embed = new EmbedBuilder()
    .setTitle("Message Deleted")
    .setColor("Red")
    .setDescription(
      `${message.content || ""}${message.attachments.size ? `\n-# **Attachments**\n${attachments}` : ``}`,
    )
    .addFields(
      {
        name: "Author",
        value: message.author ? `${message.author}` : "Unknown",
        inline: true,
      },
      {
        name: "Channel",
        value: `${message.channel}`,
        inline: true,
      },
    )
    .setTimestamp()
    .setAuthor({
      iconURL:
        message.member?.displayAvatarURL() ??
        message.author?.displayAvatarURL(),
      name:
        message.member?.displayName ??
        message.author?.displayName ??
        message.author?.username ??
        `undefined user`,
    });
  await channel.send({ embeds: [embed] });
};

export default handler;
