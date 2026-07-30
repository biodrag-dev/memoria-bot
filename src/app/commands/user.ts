import type { ChatInputCommand, CommandData } from "commandkit";

import { ApplicationCommandOptionType } from "discord.js";

import * as userHelper from "../helpers/characterHelper";

export const command: CommandData = {
  name: "character",
  description: "Character commands",
  dmPermission: false,
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
  ],
};

export const autocomplete = async (ctx: any) => {
  const interaction = ctx.interaction;

  const focused = interaction.options.getFocused();

  const names = await userHelper.getCharacterNames(interaction.user.id);

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

  if (group !== "partner") {
    return;
  }

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
};
