import type { EventHandler } from "commandkit";
import * as embedHelper from "../../helpers/embedHelper";

const handler: EventHandler<"guildMemberRemove"> = async (member) => {
  await embedHelper.sendLeaveMsg(member.client, member.user.id);
};
export default handler;