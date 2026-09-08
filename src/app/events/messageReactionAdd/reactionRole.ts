import { EventHandler } from "commandkit";

import * as proxyHelper from "../../helpers/proxyHelper";
import { Emoji, Message } from "discord.js";

const emojiRecord: Record<string, string> = {

    
     "🍒" : `1534442001444110337`
}

const handler: EventHandler<"messageReactionAdd"> = async (reaction, user) => {
    if (user.bot) return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (err) {
            console.error(err);
            return;
        }
    }

    //if in reaction roles 
    if (reaction.message.channel.id != `${process.env.SELF_ROLES_CHANNEL} `) {
        return;
    }

    const member = reaction.message.guild?.members.fetch(user.id);
    var roleid;
    switch (reaction.emoji.name) {
        case `🍒`:
            roleid = `1534442001444110337`
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;
        case ``:
            break;

    }
};

export default handler;
