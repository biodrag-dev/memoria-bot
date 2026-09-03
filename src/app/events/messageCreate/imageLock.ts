import type { EventHandler } from "commandkit";
import { EmbedBuilder } from "discord.js";

const handler: EventHandler<"messageCreate"> = async (message) => {
    if (message.author.bot || message.webhookId) return;
    if (!message.guild) return;

    const member = await message.guild.members.fetch(message.author.id);

    //if message has attachments, below 24h limit, and doesn't have image_locked role removed (manual bypass)
    if (
        message.attachments &&
        !member.roles.cache.has(`${process.env.IMAGE_LOCKED_ROLE}`) &&
        message.createdTimestamp - member.joinedTimestamp! < 24 * 60 * 60 * 1000
    ) {


        const embed = new EmbedBuilder()
            .setTitle("Hey there, looks like you're trying to send an attachment!")
            .setDescription(
                "Unfortunately, we have a 24-hour new member lock on attachments being sent to prevent botspam and scams. You can send images after waiting out the lock. Thanks for understanding!",
            )
            .setImage(
                "https://i.pinimg.com/originals/a9/2c/7f/a92c7f4d40f9b0db44be33c5e642bfdf.gif",
            )
            .setFooter({ text: "banner by @guttykreum on tumblr" });
        const lock = await message.reply({ embeds: [embed] });
        message.delete();

        //deletes embed
        setTimeout(() => {
            lock.delete().catch(() => { });
        }, 15_000);

        //else if they've been here past 24 hours and have image lock role still
    } else if (member.roles.cache.has(`${process.env.IMAGE_LOCKED_ROLE}`) && message.createdTimestamp - member.joinedTimestamp! < 24 * 60 * 60 * 1000) {
        member.roles.remove(`${process.env.IMAGE_LOCKED_ROLE}`);
    }
};

export default handler;
