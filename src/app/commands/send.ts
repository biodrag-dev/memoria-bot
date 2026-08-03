import {
  ApplicationCommandOptionType,
  ChannelType,
  InteractionContextType,
} from "discord.js";

export const command: CommandData = {
  name: "send",
  description: "send a msg",
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
          channelTypes: [ChannelType.GuildText],
        },
      ],
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const channel = interaction.options.getChannel("channel", true);

  if (!channel.isTextBased()) {
    return interaction.reply({
      content: "That isn't a text channel.",
      ephemeral: true,
    });
  }
  const msg = await channel.send({
    content: "hi",
  });

  await interaction.reply({
    content: `Message has been sent!`,
    ephemeral: true,
  });
};
