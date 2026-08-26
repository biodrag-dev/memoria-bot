import type { EventHandler } from "commandkit";
import * as embedHelper from "../../helpers/embedHelper";

const handler: EventHandler<"guildMemberAdd"> = async (member) => {


    // await member.roles.add();

    await embedHelper.sendEnterMsg(member.client, member.user.id)
};

export default handler;