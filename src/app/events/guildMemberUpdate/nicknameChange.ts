import type { EventHandler } from "commandkit";
import { sendMemberLog } from "../../helpers/embedHelper";
import { EmbedBuilder } from "discord.js";

const handler: EventHandler<"guildMemberUpdate"> = async (
  oldMember,
  newMember,
) => {

  if (oldMember.nickname === newMember.nickname) return;

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setAuthor({
      name: newMember.user.tag,
      iconURL: newMember.user.displayAvatarURL(),
    })
    .setTitle("Nickname Updated")
    .addFields(
      {
        name: "User",
        value: `${newMember}`,
      },
      {
        name: "Before",
        value: oldMember.nickname ?? "None",
        inline: true,
      },
      {
        name: "After",
        value: newMember.nickname ?? "None",
        inline: true,
      },
    )
    .setTimestamp();

  await sendMemberLog(newMember.guild, embed);

};

export default handler;
