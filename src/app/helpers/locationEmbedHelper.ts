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