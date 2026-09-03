import {
  ApplicationCommandOptionType,
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
  name: "send",
  description: "send a msg",
  default_member_permissions: "0",

  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "message",
      description: "Send a message",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "Where to send the message",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
        {
          name: "text",
          description: "what to send",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const channel = interaction.options.getChannel("channel", true) as TextChannel;

  if (!channel.isTextBased()) {
    return interaction.reply({
      content: "That isn't a channel I can send messages to.",
      ephemeral: true,
    });
  }

  await channel.send({
    content: interaction.options.getString("text", true),
  });

  await interaction.reply({
    content: "Message has been sent!",
    ephemeral: true,
  });
};
