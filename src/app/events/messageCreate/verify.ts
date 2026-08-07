import type { EventHandler } from "commandkit";

const VERIFIED_ROLE_ID = process.env.MEMBER_ROLE;
const UNVERIFIED_ROLE_ID = process.env.UNVERIFIED_ROLE;

const KEYWORD = "starburst";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.channel.id !== process.env.VERIFY_CHANNEL) return;

  if (!message.content.trim().toLowerCase().includes(KEYWORD)) {
    setTimeout(() => {
      message.delete().catch(() => {});
    }, 30_000);
  } else {
    const member = await message.guild.members.fetch(message.author.id);

    await member.roles.add(VERIFIED_ROLE_ID!);
    await member.roles.remove(UNVERIFIED_ROLE_ID!);

    // Optional
    await message.delete().catch(() => {});
  }
};

export default handler;
