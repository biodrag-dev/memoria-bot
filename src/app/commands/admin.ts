import type { ChatInputCommand, CommandData } from "commandkit";

import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

import * as userHelper from "../helpers/characterHelper";

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("admin-delete-accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("admin-delete-decline")
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger),
);

export const command: CommandData = {
  name: "admin",
  description: "Admin only commands!",
  defaultMemberPermissions: "0",

  options: [
    {
      name: "register-character",
      description: "Register a character",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Who is this character being registered for?",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "character-name",
          description: "What is the character's name?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "house",
          description: "Which house is the character in?",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            {
              name: "Victini",
              value: "Victini",
            },
            {
              name: "Jirachi",
              value: "Jirachi",
            },
            {
              name: "Mew",
              value: "Mew",
            },
          ],
        },
        {
          name: "evolutionary-destination",
          description: "Evolutionary destination",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "shiny",
          description: "Is their partner shiny?",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
      ],
    },

    {
      name: "edit",
      description: "Edit a character",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "roleplayer",
          description: "Character owner",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "character",
          description: "Character name",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },

    {
      name: "delete",
      description: "Delete character data",
      type: ApplicationCommandOptionType.SubcommandGroup,

      options: [
        {
          name: "character",
          description: "Delete a character",
          type: ApplicationCommandOptionType.Subcommand,

          options: [
            {
              name: "roleplayer",
              description: "Character owner",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "character",
              description: "Character name",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },

        {
          name: "all",
          description: "Delete all characters",
          type: ApplicationCommandOptionType.Subcommand,

          options: [
            {
              name: "roleplayer",
              description: "Character owner",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
          ],
        },
      ],
    },
  ],
};

export const autocomplete = async (ctx: any) => {
  const interaction = ctx.interaction;

  const focused = interaction.options.getFocused();
  const sub = interaction.options.getSubcommand();

  if (sub !== "edit" && sub !== "character") {
    return;
  }

  const user = interaction.options._hoistedOptions[0].value;

  if (!user) {
    return interaction.respond([]);
  }

  const names = await userHelper.getCharacterNames(user);

  const filtered = names
    .filter((name: string) =>
      name.toLowerCase().startsWith(focused.toLowerCase()),
    )
    .slice(0, 25);

  await interaction.respond(
    filtered.map((name: string) => ({
      name,
      value: name,
    })),
  );
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const group = interaction.options.getSubcommandGroup(false);
  const sub = interaction.options.getSubcommand();

  if (sub === "register-character") {
    const embed = await userHelper.registerCharacter(
      interaction.options.getUser("user")!.id,
      interaction.options.getString("character-name")!,
      interaction.options.getString("house")!,
      interaction.options.getString("evolutionary-destination")!,
      interaction.options.getBoolean("shiny")!,
    );

    return interaction.reply({
      embeds: [embed],
    });
  }

  if (sub === "edit") {
    const embed = await userHelper.editCharacter(
      interaction.options.getUser("roleplayer")!.id,
      interaction.options.getString("character")!,
    );

    return interaction.reply({
      embeds: [embed],
    });
  }

  if (group === "delete") {
    if (sub === "all") {
      const embed = await userHelper.deleteCharacter(
        interaction.options.getUser("roleplayer")!.id,
      );

      return interaction.reply({
        embeds: [embed],
      });
    }

    if (sub === "character") {
      await interaction.reply({
        content: `Are you sure you want to delete ${interaction.options.getString("character")}?`,
        components: [row],
      });
      const message = await interaction.fetchReply();
      const collector = message.createMessageComponentCollector({
        time: 30_000,
      });

      collector.on("collect", async (button) => {
        if (button.user.id !== interaction.user.id) {
          return button.reply({
            content: "This confirmation isn't for you.",
            ephemeral: true,
          });
        }

        if (button.customId === "admin-delete-accept") {
          await button.update({
            content: `${interaction.options.getString("character")} has been deleted!`,
            components: [],
          });
          await userHelper.deleteCharacter(interaction.options.getUser("roleplayer").id, interaction.options.getString("character"));
          collector.stop();
        }

        if (button.customId === "admin-delete-decline") {
          await button.update({
            content: "Cancelled.",
            components: [],
          });

          collector.stop();
        }
      });

      return;
    }
  }
};
