import { EmbedBuilder, User } from "discord.js";
import { sendMemberLog } from "../../helpers/embedHelper";
import { EventHandler } from "commandkit";

const handler: EventHandler<"userUpdate"> = async (
    oldUser,
    newUser,
) => {
    if (oldUser.username === newUser.username) return;
    for (const guild of newUser.client.guilds.cache.values()) {
        if (!guild.members.cache.has(newUser.id)) continue;

        const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setAuthor({
                name: newUser.tag,
                iconURL: newUser.displayAvatarURL(),
            })
            .setTitle("Username Updated")
            .addFields(
                {
                    name: "User",
                    value: `${newUser}`,
                },
                {
                    name: "Before",
                    value: oldUser.username ?? `Not cached`,
                    inline: true,
                },
                {
                    name: "After",
                    value: newUser.username,
                    inline: true,
                },
            )
            .setTimestamp();

        await sendMemberLog(guild, embed);
    }
}

export default handler;
