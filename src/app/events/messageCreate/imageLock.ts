import type { EventHandler } from "commandkit";

const VERIFIED_ROLE_ID = process.env.MEMBER_ROLE;
const UNVERIFIED_ROLE_ID = process.env.UNVERIFIED_ROLE;
import * as embedHelper from "../../helpers/embedHelper";

const handler: EventHandler<"messageCreate"> = async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const member = await message.guild.members.fetch(message.author.id);
    console.log(member.joinedTimestamp);
    console.log(message.createdTimestamp);

    if (message.attachments) {

        message.createdTimestamp

    } else {
        const member = await message.guild.members.fetch(message.author.id);

        await member.roles.add(VERIFIED_ROLE_ID!);
        await member.roles.remove(UNVERIFIED_ROLE_ID!);

        // Optional
        await message.delete().catch(() => { });
        embedHelper.sendWelcomeMsg(message.client, message.author.id)
    }
};

export default handler;
