import {
    AuditLogEvent,
    EmbedBuilder,
    GuildBan,
} from "discord.js";
import { sendMemberLog } from "../../helpers/embedHelper";
import { EventHandler } from "commandkit";

const handler: EventHandler<"guildBanAdd"> = async (
    ban,
) => {
    let moderator = "Unknown";

    try {
        const logs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanAdd,
            limit: 5,
        });

        const entry = logs.entries.find(
            (entry) => entry.target?.id === ban.user.id,
        );

        if (entry?.executor) {
            moderator = `${entry.executor} (\`${entry.executor.id}\`)`;
        }
    } catch {
        // Bot may not have permission to view audit logs.
    }

    const embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setAuthor({
            name: ban.user.tag,
            iconURL: ban.user.displayAvatarURL(),
        })
        .setTitle("Member Banned")
        .addFields(
            {
                name: "User",
                value: `${ban.user} (\`${ban.user.id}\`)`,
            },
            {
                name: "Moderator",
                value: moderator,
            },
        )
        .setTimestamp();

    await sendMemberLog(ban.guild, embed);
}
