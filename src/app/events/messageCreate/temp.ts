// import type { EventHandler } from "commandkit";

// const VERIFIED_ROLE_ID = process.env.MEMBER_ROLE;
// const UNVERIFIED_ROLE_ID = process.env.UNVERIFIED_ROLE;
// import * as embedHelper from "../../helpers/embedHelper";
// import { EmbedBuilder } from "discord.js";

// const KEYWORD = "!WHAT IS HOUSES";

// const handler: EventHandler<"messageCreate"> = async (message) => {
//   if (message.author.bot) return;
//   if (!message.guild) return;

//   if (message.content.trim().includes(KEYWORD)) {
//     var forumChannel =
//       await message.client.channels.fetch(`1527303791500722256`);

//     const embed = new EmbedBuilder()
//       .setTitle(`𝐇𝐈𝐒𝐓𝐎𝐑𝐘`)
//       .setColor("#e6adad")
//       .setDescription(
//         `In the distant past, long before the region of Randian had a name, a great uprising had bloodied its ancient lands.

// Perhaps it was because of the overcrowded and neglected; trainers catching Pokemon that they simply could not take care of—or, perhaps it was the abused, suffering from those in power forcing their Pokemon to commit deeds of evil. Regardless, it was the mistreatment of Pokemon that shifted the tides into one of war—an Uprising strong enough to shatter the norm.

// It was a messy conflict, one that left families bereft of children and parents on both sides. Humans were powerless before the might of Pokemon, but their ingenuity kept them three steps ahead as they forced Pokemon to fight against their own kind. During those times, it was so bleak that the only future each side could imagine was one where the other was eradicated entirely.

// When all hope seemed lost, three mythical Pokemon descended from the skies—bringing unity to the lands.

// Thanks to the intervention of Victini, Jirachi, and Mew, the war slowed to a stop, and negotiations began. Some argued for the complete separation of humans and pokemon, while others argued for the status quo to be continued and for the uproar to be disregarded and forgotten. 

// In the end, humans and Pokemon came to a compromise. 

// There would no longer be trainers with full teams of pokemon, but rather: one Pokemon, if at all. It was decided that this would prevent the abuse of power humans had held over their supposed companions for so long, allowing humans to develop and truly bond with their chosen Partner.

// While most of the precise historical details have been lost to time, that is the legends for how the one-on-one partnerships between Humans and Pokemon have begun.

// As people began adjusting to this new way of life, so did society. It wasn’t as if Pokemon were prohibited from hanging out with Trainers who already had a partner Pokemon—they were simply unable to be caught, remaining wild Pokemon on their own terms. 

// Regulations began springing up, from the restriction of Pokeball sales to the decision on who could receive official Pokemon Partners entirely. Eventually, it was decided that all trainers would require a formal education—not only to avoid repeating the atrocities of the past and teach them how to properly care for their Pokemon partner’s needs, but also to prepare them for the real world.

// That is the origin of Dexlight Academy, the starting place for all trainers.`,
//       )
//       .setImage(
//         "https://64.media.tumblr.com/feceffc1039c6e37583700ca47730407/4127768b7eafaf67-9d/s1280x1920/635c02ff3664cee5be9504b26d3c549de3c953e3.gif",
//       )
//       .setFooter({
//         text: `banner by @apolism on tumblr`,
//       });

//     const thread = await forumChannel!.threads.create({
//       name: `𝐇𝐈𝐒𝐓𝐎𝐑𝐘`,
//       message: {
//         embeds: [embed],
//       },
//     });
//     // Optional
//     await message.delete().catch(() => {});
//   }
// };

// export default handler;


import type { EventHandler } from "commandkit";
import { EmbedBuilder } from "discord.js";

const KEYWORD = "m!ad";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.trim().includes(KEYWORD)) {
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
➤ No Fakemon, OC-only setting
➤ Slower paced plot that leaves room for IRL
➤ Custom Coded Bot for Character Profiles
➤ A Brand New Region to explore!
➤ One-per-trainer Partner Pokemon System
➤ Opportunities for non-battler OCs to shine
➤ An emphasis of Quality over Quantity for writing + OCs
➤ Artist-Centric 
➤ Safe, welcoming, and LGBTQ+ friendly environment
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
    await message.delete().catch(() => {});
  }
};

export default handler;
