// import type { EventHandler } from "commandkit";
// import { EmbedBuilder, ForumChannel } from "discord.js";

// const KEYWORD = "!WHAT IS";

// const handler: EventHandler<"messageCreate"> = async (message) => {
//     if (message.author.bot || message.webhookId) return;
//     if (!message.guild) return;

//     if (message.content.trim().startsWith(KEYWORD)) {
//         const keyword = message.content.replace(KEYWORD, "").trim();

//         var forumChannel =
//             await message.client.channels.fetch(`1527303791500722256`);

//         const embed = new EmbedBuilder()
//             .setTitle(`placeholder`)
//             .setColor("#e6adad")
//             .setDescription(
//                 `placeholder`,
//             )
//             .setImage(
//                 "https://64.media.tumblr.com/feceffc1039c6e37583700ca47730407/4127768b7eafaf67-9d/s1280x1920/635c02ff3664cee5be9504b26d3c549de3c953e3.gif",
//             )
//             .setFooter({
//                 text: `banner by @apolism on tumblr`,
//             });

//         const thread = await (forumChannel as ForumChannel)!.threads.create({
//             name: keyword,
//             message: {
//                 embeds: [embed],
//             },
//         });
//         // Optional
//         await message.delete().catch(() => { });
//     }
// };

// export default handler;

