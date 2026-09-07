import { EmbedBuilder } from "discord.js";

import fs from "fs/promises";
import path from "path";
const jsonsPath = path.resolve(__dirname, "../../../jsons");

var embeds: Record<string, EmbedBuilder> = await loadEmbeds();

async function loadEmbeds() {
  const data = await fs.readFile(`${jsonsPath}/embeds.json`, "utf8");
  return JSON.parse(data) as Record<string, EmbedBuilder>;
}

export function embed(name: string) {
  loadEmbeds();
  if (embeds[name]) {
    return { content: ``, embeds: [embeds[name]] };
  } else {
    return { content: `No embed linked to codeword!`, ephemeral: true };
  }
}