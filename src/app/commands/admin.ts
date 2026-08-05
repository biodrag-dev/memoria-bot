import type { ChatInputCommand, CommandData } from "commandkit";

import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionContextType,
} from "discord.js";

import * as userHelper from "../helpers/characterHelper";

import { EmbedBuilder } from "discord.js";

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
  default_member_permissions: "0",
  dm_permission: false,

  contexts: [InteractionContextType.Guild],
  options: [
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

  if (!interaction.inGuild()) {
    return interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
  }

  const group = interaction.options.getSubcommandGroup(false);
  const sub = interaction.options.getSubcommand();

  if (sub === "edit") {
    // const embed = await userHelper.editCharacter(
    //   interaction.options.getUser("roleplayer")!.id,
    //   interaction.options.getString("character")!,
    // );
    // return interaction.reply({
    //   embeds: [embed],
    // });
  }

  if (group === "delete") {
    let embed = new EmbedBuilder();
    if (sub === "all") {
      embed
        .setDescription(
          `Are you sure you want to delete all of <@${interaction.options.getUser("roleplayer")!.id}>'s data? This decision cannot be reversed.`,
        )
        .setColor("Red");
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
      const message = await interaction.fetchReply();
      const collector = message.createMessageComponentCollector({
        time: 30_000,
      });

      collector.on("collect", async (button) => {
        if (button.user.id !== interaction.user.id) {
          embed.setDescription(`This confirmation isn't for you.`);
          button.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }

        if (button.customId === "admin-delete-accept") {
          embed.setDescription(
            `All of <@${interaction.options.getUser("roleplayer")!.id}>'s server data has been deleted.`,
          );
          const member = await interaction.guild!.members.fetch(
            interaction.options.getUser("roleplayer", true).id,
          );
          await member.roles.remove(`${process.env.ROLEPLAYER_ROLE}`); //roleplayer role

          await button.update({
            embeds: [embed],
            components: [],
          });
          await userHelper.deleteAll(
            interaction.options.getUser("roleplayer", true).id
          );
          collector.stop();
        }

        if (button.customId === "admin-delete-decline") {
          embed.setDescription(
            `Deletion of <@${interaction.options.getUser("roleplayer")!.id}>'s characters cancelled.`,
          );
          embed.setColor("Green");
          await button.update({
            embeds: [embed],
            components: [],
          });

          collector.stop();
        }
      });

      return;
    }

    if (sub === "character") {
      embed
        .setDescription(
          `Are you sure you want to delete ${interaction.options.getString("character")}?`,
        )
        .setColor("Red");
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
      const message = await interaction.fetchReply();
      const collector = message.createMessageComponentCollector({
        time: 30_000,
      });

      collector.on("collect", async (button) => {
        if (button.user.id !== interaction.user.id) {
          embed.setDescription(`This confirmation isn't for you.`);
          button.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }

        if (button.customId === "admin-delete-accept") {
          embed.setDescription(
            `${interaction.options.getString("character", true)} has been deleted!`,
          );

          await button.update({
            embeds: [embed],
            components: [],
          });
          await userHelper.deleteCharacter(
            interaction.options.getUser("roleplayer", true).id,
            interaction.options.getString("character", true),
          );
          collector.stop();
        }

        if (button.customId === "admin-delete-decline") {
          embed.setDescription(`Deletion cancelled.`);
          embed.setColor("Green");
          await button.update({
            embeds: [embed],
            components: [],
          });

          collector.stop();
        }
      });

      return;
    }
  }
};
