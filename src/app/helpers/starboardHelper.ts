import { Client, EmbedBuilder, Message, TextChannel } from "discord.js";
import fs from "fs/promises";
import path from "path";
const jsonsPath = path.resolve(__dirname, "../../../jsons");

var stars: Record<string, string>;
const starMinimum = 1;

export async function loadStars() {
  if (!stars) {
    const data = await fs.readFile(`${jsonsPath}/stars.json`, "utf8");
    stars = JSON.parse(data) as Record<string, string>;
  }
}

export async function saveStars() {
  await fs.writeFile(
    `${jsonsPath}/stars.json`,
    JSON.stringify(stars, null, 2),
    "utf8",
  );
}

export function getEmbed(stars: number, message: Message) {
  const embed = new EmbedBuilder();
  if (message.content) {
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

  return {
    content: `⭐ **${stars}** ${message.url}`,
    embeds: [embed],
  };
}

export async function starMessage(
  client: Client,
  starReactions: number,
  message: Message,
) {
  if (starReactions < starMinimum) {
    return;
  }

  await loadStars();

  const channel = (await client.channels.fetch(
    `${process.env.STARBOARD_CHANNEL}`,
  )) as TextChannel;
  const msgInfo = getEmbed(starReactions, message);

  if (stars[message.id]) {
    const starredMsg = await channel.messages.fetch(`${stars[message.id]}`);
    starredMsg.edit(msgInfo);
    return false;
  }

  const starredMsg = await channel.send(msgInfo);

  stars[message.id] = starredMsg.id;
  await saveStars();
  return true;
}

export async function removeStar(
  client: Client,
  starReactions: number,
  message: Message,
) {
  await loadStars();
  const channel = (await client.channels.fetch(
    `${process.env.STARBOARD_CHANNEL}`,
  )) as TextChannel;

  const starredMsg = await channel.messages.fetch(`${stars[message.id]}`);

  if (starReactions < starMinimum) {
    delete stars[message.id];
    await starredMsg.delete();
    await saveStars();
  } else {
    const msgInfo = getEmbed(starReactions, message);
    starredMsg.edit(msgInfo);
  }
}
