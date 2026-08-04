import type { ChatInputCommand, CommandData } from "commandkit";

import {
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";

import * as characterHelper from "../helpers/characterHelper";

export const command: CommandData = {
  name: "character",
  description: "Character commands",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "partner",
      description: "Partner Pokémon commands",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "view",
          description: "View your partner Pokémon",
          type: ApplicationCommandOptionType.Subcommand,

          options: [
            {
              name: "character",
              description: "Whose partner are you viewing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },

        {
          name: "nickname",
          description: "Edit your partner's nickname",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "character",
              description: "Whose partner are you nicknaming?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "nickname",
              description: "What is the new nickname?",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },

        {
          name: "dex-entry",
          description: "View your partner Pokémon's dex entry",
          type: ApplicationCommandOptionType.Subcommand,

          options: [
            {
              name: "character",
              description: "Whose partner are you viewing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },

        {
          name: "evolve",
          description: "Evolve your partner Pokémon",
          type: ApplicationCommandOptionType.Subcommand,

          options: [
            {
              name: "character",
              description: "Whose partner are you evolving?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },
      ],
    },
    {
      name: "view",
      description: "View your character",
      type: ApplicationCommandOptionType.Subcommand,

      options: [
        {
          name: "character",
          description: "Whose profile are you viewing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },

    {
      name: "edit",
      description: "Edit your character's bio",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "character",
          description: "Whose profile are you editing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: "field",
          description: "Which field are you editing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Age", value: "age" },
            { name: "Gender", value: "gender" },
            { name: "Bio", value: "bio" },
            { name: "Pronouns", value: "pronouns" },
          ],
        },
        {
          name: "information",
          description: "What are you filling in the detail with?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "edit-image",
      description: "Edit your character's display image",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "character",
          description: "Whose profile are you editing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: "art-link",
          description: "What is the link to the art?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "artist-credit",
          description: "Who drew the art you are now using?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};

export const autocomplete = async (ctx: any) => {
  console.log("autocomplete")
  const interaction = ctx.interaction;

  const focused = interaction.options.getFocused();

  const names = await characterHelper.getCharacterNames(interaction.user.id);

  const filtered = names
    .filter((name: string) =>
      name.toLowerCase().startsWith(focused.toLowerCase()),
    )
    .slice(0, 25);

  return interaction.respond(
    filtered.map((name: string) => ({
      name,
      value: name,
    })),
  );
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const group = interaction.options.getSubcommandGroup();

  const sub = interaction.options.getSubcommand();

  if (group === "partner") {
    switch (sub) {
      case "view": {
        const character = interaction.options.getString("character")!;

        /*
        Replace with your helper:

        const embed =
          await userHelper.viewPartner(
            interaction.user.id,
            character
          );

        return interaction.reply({
          embeds: [embed]
        });
      */

        return interaction.reply(
          `Viewing partner for ${character} (not implemented yet).`,
        );
      }

      case "nickname": {
        const character = interaction.options.getString("character")!;
        const nickname = interaction.options.getString("nickname")!;

        /*
        Replace with:

        const embed =
          await userHelper.renamePartner(
            interaction.user.id,
            character,
            nickname
          );
      */

        return interaction.reply(
          `Changing ${character}'s nickname to ${nickname} (not implemented yet).`,
        );
      }

      case "dex-entry": {
        const character = interaction.options.getString("character")!;

        /*
        Replace with your dex entry helper.
      */

        return interaction.reply(
          `Dex entry for ${character} (not implemented yet).`,
        );
      }

      case "evolve": {
        const character = interaction.options.getString("character")!;

        /*
        Replace with your evolution helper.
      */

        return interaction.reply(
          `Evolution for ${character} (not implemented yet).`,
        );
      }
    }
  } else if (sub === "view") {
    const character = interaction.options.getString("character")!;
    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      character,
    );

    return interaction.reply({
      embeds: [embed],
    });
  }
};
