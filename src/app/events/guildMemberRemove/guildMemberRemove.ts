import type { EventHandler } from "commandkit";
import * as embedHelper from "../../helpers/embedHelper";
import * as submitHelper from "../../helpers/extraHelpers/submitHelper";

const handler: EventHandler<"guildMemberRemove"> = async (member) => {
  await embedHelper.sendLeaveMsg(member.client, member.user.id);

    const reserve = await submitHelper.getReserveOfUser(member.user.id);
    if(reserve.length != 0){
      submitHelper.deleteDestination(reserve[0]!);
    }
};
export default handler;