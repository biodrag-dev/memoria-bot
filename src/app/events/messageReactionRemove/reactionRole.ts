import { EventHandler } from "commandkit";

const emojiRecord: Record<string, string> = {
  "🍒": `1534457442698661939`,
  "🍁": `1534457486625607760`,
  "🍓": `1534457524798095441`,
  "🍷": `1534457591105716344`,
  "🏮": `1534457630494294087`,
  "🍹": `1534457967779250277`,
  "🍊": `1534457994295906327`,
  "☀️": `1534460070635769936`,
  "🐝": `1534460189518856332`,
  "🐥": `1534460232024195143`,
  "🍵": `1534460372675858544`,
  "🍃": `1534460455534334003`,
  "🧩": `1534460500174442576`,
  "🐟": `1534456980993998848`,
  "🐬": `1534457025768194169`,
  "🌊": `1534457061210066994`,
  "🌀": `1534457107628163082`,
  "🍇": `1534631480373018655`,
  "👾": `1534631563906777099`,
  "🔮": `1534631736124772586`,
  "☂️": `1534631779061727412`,
  "💜": `1539913483653746748`,
};

const handler: EventHandler<"messageReactionRemove"> = async (
  reaction,
  user,
) => {
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
  if (reaction.message.channel.id != `${process.env.SELF_ROLES_CHANNEL}`) {
    return;
  }
  const member = await reaction.message.guild?.members.fetch(user.id);
  const roleId = emojiRecord[reaction.emoji.name ?? ``];
  if (roleId) {
    member?.roles.remove(roleId);
  }
};

export default handler;
