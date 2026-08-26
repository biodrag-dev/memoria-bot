import type { EventHandler } from "commandkit";
import { EmbedBuilder } from "discord.js";
import * as locationEmbedHelper from "../../helpers/locationEmbedHelper";

const KEYWORD = "m!location";

const handler: EventHandler<"messageCreate"> = async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;


    if (message.content.trim().startsWith(KEYWORD)) {
        var channel = message.channel;
        const keyword = message.content.replace(KEYWORD, "").trim();

        const msg = locationEmbedHelper.embed(keyword)

        if (msg.ephemeral) {
            const locEmbed = await message.reply(msg);
            setTimeout(() => {
                locEmbed.delete().catch(() => { });
            }, 3_000);
            return;
        } else if (message.reference) {
            const original = await message.fetchReference();
            original.edit(msg);
            await message.delete().catch(() => { });
        } else {
            const locEmbed = await channel.send(msg);
            const pinMsg = await locEmbed.pin();
            await message.delete().catch(() => { });
        }
    }
};

export default handler;
