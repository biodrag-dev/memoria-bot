import type { EventHandler } from "commandkit";
import { EmbedBuilder, TextChannel } from "discord.js";

const handler: EventHandler<"messageUpdate"> = async (
  oldMessage,
  newMessage,
) => {
  if (oldMessage.partial) {
    try {
      await oldMessage.fetch();
    } catch (error) {
      console.error("Failed to fetch old message:", error);
      return;
    }
  }

  if (newMessage.partial) {
    try {
      await newMessage.fetch();
    } catch (error) {
      console.error("Failed to fetch new message:", error);
      return;
    }
  }

  if (oldMessage.author?.bot) return;
  if (oldMessage.content === newMessage.content) return;

  const channel = (await oldMessage.client.channels.fetch(
    `${process.env.MESSAGE_LOG}`,
  )) as TextChannel;

  const embed = new EmbedBuilder()
    .setTitle("Message Edited")
    .setColor("Yellow")
    .addFields(
      {
        name: "Author",
        value: newMessage.author ? `${newMessage.author}` : "Unknown",
        inline: true,
      },
      {
        name: "Channel",
        value: newMessage.url,
        inline: true,
      },
    )
    .setDescription(
      `**Before:**\n${oldMessage.content || "*`Content not Cached`*"}\n\n` +
        `**After:**\n${newMessage.content || "*`Content not Cached`*"}`,
    )
    .setAuthor({
      iconURL:
        newMessage.member?.displayAvatarURL() ??
        newMessage.author.displayAvatarURL(),
      name: newMessage.member?.displayName ?? newMessage.author.displayName,
    })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
};

export default handler;
