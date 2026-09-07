import type { EventHandler } from "commandkit";
import * as embedHelper from "../../helpers/embedHelper";
import * as boosterHelper from "../../helpers/extraHelpers/boosterHelper";

const handler: EventHandler<"guildMemberUpdate"> = async (
  oldMember,
  newMember,
) => {
  // User started boosting
  if (!oldMember.premiumSince && newMember.premiumSince) {
    await embedHelper.sendBoostMsg(newMember.client, newMember.user.id);
  }

  // User stopped boosting
  if (oldMember.premiumSince && !newMember.premiumSince) {
    await boosterHelper.removeBoosterRole(newMember.client, newMember.user.id);
  }
};

export default handler;
