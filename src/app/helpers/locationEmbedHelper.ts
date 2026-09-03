import { EmbedBuilder } from "discord.js";

import fs from "fs/promises";
import path from "path";
const jsonsPath = path.resolve(__dirname, "../../../jsons");

var embeds: Record<string, EmbedBuilder>;

async function loadEmbeds() {
  if (!embeds) {
    const data = await fs.readFile(`${jsonsPath}/embeds.json`, "utf8");

    embeds = JSON.parse(data) as Record<string, EmbedBuilder>;
  }
}

export async function embed(name: string) {
  await loadEmbeds();
  if (embeds[name]) {
    return { content: ``, embeds: [embeds[name]] };
  } else {
    return { content: `No embed linked to codeword!`, ephemeral: true };
  }
}

function getEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐎𝐍𝐆𝐎𝐈𝐍𝐆 𝐑𝐄𝐒𝐄𝐑𝐕𝐀𝐓𝐈𝐎𝐍𝐒`)
    .setColor("Red")
    .setDescription(`descHere`)
    .setImage(
      "https://static2.klipy.com/ii/f87f46a2c5aeaeed4c68910815f73eaf/27/de/PSYjpPT7.gif",
    )
    .setFooter({
      text: "banner by @anasabdin on tumblr",
    });

  return embed;
}
