// import type { EventHandler } from "commandkit";

// const VERIFIED_ROLE_ID = process.env.MEMBER_ROLE;
// const UNVERIFIED_ROLE_ID = process.env.UNVERIFIED_ROLE;
// import * as embedHelper from "../../helpers/embedHelper";
// import { EmbedBuilder } from "discord.js";

// const KEYWORD = "WHAT IS A STAFF NPC";

// const handler: EventHandler<"messageCreate"> = async (message) => {
//   if (message.author.bot) return;
//   if (!message.guild) return;

//   if (message.content.trim().includes(KEYWORD)) {
//     console.log("Messga")
//     var forumChannel =
//       await message.client.channels.fetch(`1540209862489939999`);

//     const embed = new EmbedBuilder()
//       .setTitle(`𝐒𝐓𝐎𝐑𝐘 𝐍𝐏𝐂𝐒`)
//       .setColor("#393b42")
//       .setDescription(
//         `Only story/event planners and event hosters are able to make [**Story NPCs**]. While they do not take up an OC slot, they are not a way to bypass the extra character rules! These created for the express purpose of helping the story along, and as such, they cannot be used outside of events where they're supposed to be there.`,
//       )
//       .setImage(
//         "https://i.pinimg.com/originals/84/ae/ae/84aeaec6b6e64730b07610a8474022ca.gif",
//       )
//       .setFooter({
//         text: `banner by @motocross_saito on tumblr`,
//       });

//     const thread = await forumChannel!.threads.create({
//       name: `𝐖𝐇𝐀𝐓 𝐀𝐑𝐄 𝐒𝐓𝐎𝐑𝐘 𝐍𝐏𝐂𝐒?`,
//       message: {
//         embeds: [embed],
//       },
//     });
//     // Optional
//     await message.delete().catch(() => {});
//   }
// };

// export default handler;
