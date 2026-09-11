import { ColorResolvable, EmbedBuilder } from "discord.js";

import fs from "fs";
import path from "path";
const jsonsPath = path.resolve(__dirname, "../../../jsons");

var embeds: Record<string, EmbedBuilder> = loadEmbeds();

function loadEmbeds() {
  const data = fs.readFileSync(`${jsonsPath}/embeds.json`, "utf8");
  return JSON.parse(data) as Record<string, EmbedBuilder>;
}

export function embed(name: string, color?: string | undefined) {
  const embed = embeds[name]
    ? { embeds: [embeds[name].setColor(color as ColorResolvable)] }
    : {
        embeds: [
          new EmbedBuilder().setDescription("embed could not be found!"),
        ],
        ephemeral: true,
      };
  if (color) {
    fs.writeFileSync(
      `${jsonsPath}/embeds.json`,
      JSON.stringify(embeds, null, 2),
      "utf8",
    );
  }
  return embed;
}

export function importEmbeds() {
  const visual = fs
    .readFileSync(`${jsonsPath}/locationsVisual.txt`, "utf8")
    .split("* ");
  const data = fs
    .readFileSync(`${jsonsPath}/locationDescs.txt`, "utf8")
    .split("> ");

  if (visual.length == data.length) {
    for (var i = 1; i < data.length; i++) {
      if (data[i]) {
        const stuff = visual[i]!.split("\n");
        const embed = new EmbedBuilder();
        embed.setTitle(stuff[0]?.trim() ?? "FORGOTTEN TITLE");
        embed.setDescription(data[i]?.trim() ?? "FORGOTTEN DESCRIPTION");
        embed.setFooter({ text: stuff[1]?.trim() ?? "FORGOTTEN ARTIST" });
        embed.setImage(stuff[2]?.trim() ?? null);
        embeds[`location${i}`] = embed;
      }
    }
  }
  fs.writeFileSync(
    `${jsonsPath}/embeds.json`,
    JSON.stringify(embeds, null, 2),
    "utf8",
  );
}
