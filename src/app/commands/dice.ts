import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  InteractionContextType,
  TextChannel,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";

export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

export const command: CommandData = {
  name: "roll",
  description: "dice commands!",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "dice",
      description:
        "What's the size of the dice being rolled? (ie. 20 for a d20)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "amount",
      description: "How many of these dice are being rolled? (defaults to one)",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const rollSize = interaction.options.getInteger("dice", true);
  const diceAmount = interaction.options.getInteger("amount") ?? 1;
  const rolls = [];
  var total = 0;
  for (var i = 0; i < diceAmount; i++) {
    const roll = Math.floor(Math.random() * rollSize) + 1;
    rolls.push(roll);
    total += roll;
  }
  const embed = new EmbedBuilder()
    .setDescription(
      `🎲 **Result** | ${total}${diceAmount != 1 ? ` (${rolls.join(" + ")})` : ``}`,
    )
    .setTitle(`Rolling (${diceAmount}d${rollSize})...`)
    .setColor("Random");
  await interaction.reply({
    embeds: [embed],
  });
};
