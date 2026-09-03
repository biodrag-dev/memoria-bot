import { EmbedBuilder, Message } from "discord.js";

export function getEmbed(message: Message): EmbedBuilder {
  const embed = new EmbedBuilder();
  if(message.content){
    embed.setDescription(message.content);
  }
  embed.setAuthor({
    iconURL: message.author.displayAvatarURL(),
    name: message.author.username,
  });
  embed.setTimestamp();
  embed.setColor("#f4dc84");

  const image = message.attachments.find((attachment) =>
    attachment.contentType?.startsWith("image/"),
  );

  if (image) {
    embed.setImage(image.url);
  }

  return embed;
}
