import type { EventHandler } from "commandkit";
import { EmbedBuilder } from "discord.js";

const KEYWORD = "m!ad";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.trim() == KEYWORD) {
    var channel = message.channel;

    const embed = new EmbedBuilder()
      .setTitle(`『 𝐃𝐄𝐗𝐋𝐈𝐆𝐇𝐓 𝐀𝐂𝐀𝐃𝐄𝐌𝐘 』`)
      .setColor("#a1e99e")
      .setDescription(
        `╭┈ • ┈ • ┈  • ┈ .★.. ┈ • ┈╮
Long before the region of Sanyuan had a name, the world was shaken by its war. A rebellion of Pokemon against humanity—a bloodied occurrence borne from the strife of suffering Pokemon. Following the intervention of Victini, Mew, and Jirachi, a new dynamic was founded within society—one where a trainer was not commander of many pokemon, but instead a partner to one equal.

⋆⁺｡˚⋆˙‧₊☽ ◯ ☾₊‧˙⋆˚｡⁺⋆

That is the legend that you have been taught growing up, a learned legacy that explains why you must attend Dexlight Academy: a prestigious school that has ascribed itself to the duty of training the next generation of trainers. You know you’ve been destined for it since you met the Partner Pokemon by your side—but who knows what trials lie behind those walls.

Will you be the one to uncover the secrets hiding beneath the surface of the region?
╰┈ • ┈ ..★. ┈  • ┈ • ┈ • ┈╯

Welcome to Dexlight Academy! We have many things to offer you:
➤ A 16+ environment
➤ No Fakemon, OC-only setting
➤ Slower paced plot that leaves room for IRL
➤ Custom Coded Bot for Character Profiles
➤ A Brand China-inspired New Region to explore!
➤ One-per-trainer Partner Pokemon System
➤ Opportunities for non-battler OCs to shine
➤ An emphasis of Quality over Quantity for writing + OCs
➤ Safe, Welcoming, and LGBTQ+ friendly environment
And more!
˗ˏˋ ꒰ ✉︎ ꒱ ˎˊ˗`,

//【 publicly launched [TBA], 2026. 】`,
      )
      .setImage(
        "https://i.pinimg.com/originals/51/f1/13/51f1135629ff02dab6a1ad35170b1169.gif",
      )
      .setFooter({
        text: `banner by @setamo-arts on tumblr`,
      });

    await channel.send({embeds: [embed]})
    // Optional
    //await message.delete().catch(() => {});
  }
};

export default handler;
