import type { EventHandler } from "commandkit";
import * as embedHelper from "../../helpers/embedHelper";

const handler: EventHandler<"guildMemberAdd"> = async (member) => {
  await member.roles.add(`1534446196020744202`); //ooc
  await member.roles.add(`1527524907678699590`); //unverified
  await member.roles.add(`1534446504927039488`); //about
  await member.roles.add(`1541981677507715072`); //image lock

  await embedHelper.sendEnterMsg(member.client, member.user.id);
};

export default handler;
