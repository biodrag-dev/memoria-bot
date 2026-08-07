import type { ChatInputCommand, CommandData } from "commandkit";

import { ApplicationCommandOptionType } from "discord.js";

import * as pokehelper from "../helpers/pokeHelper";

export const command: CommandData = {
  name: "pokedex",
  description: "Pokédex commands",

  options: [
    {
      name: "find",
      description: "Find a Pokémon!",
      type: ApplicationCommandOptionType.Subcommand,

      options: [
        {
          name: "name",
          description: "The name of the Pokémon",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },

    {
      name: "basemon-finder",
      description: "Find the base Pokémon of an evolutionary tree!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "The name of the Pokémon",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },

    {
      name: "random-mon",
      description: "Find a random Pokémon!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "evo-path",
      description: "Find a random Pokémon!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "The name of the Pokémon",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  await interaction.deferReply();

  const sub = interaction.options.getSubcommand();

  if (sub === "find") {
    const name = interaction.options.getString("name")!;

    const pokemon = await pokehelper.findPokemon(name);

    if (!pokemon) {
      return interaction.editReply(
        `Pokémon species "${name}" could not be found!`,
      );
    }

    const embed = await pokehelper.pokeEmbedCreate(
      pokemon,
    );

    return interaction.editReply({
      embeds: [embed],
    });
  }

  if (sub === "basemon-finder") {
    const name = interaction.options.getString("name")!;
    const pokemon = await pokehelper.findPokemon(name);

    if (!pokemon) {
      return interaction.editReply(
        `Pokémon species "${name}" could not be found!`,
      );
    }

    const basemon = await pokehelper.findBaseMon(
      pokemon,
    );

    const embed = await pokehelper.pokeEmbedCreate(basemon);

    return interaction.editReply({
      embeds: [embed],
    });
  }

  if (sub === "random-mon") {
    const pokemon = await pokehelper.findRandomMon();
    const embed = await pokehelper.pokeEmbedCreate(pokemon);

    return interaction.editReply({
      embeds: [embed],
    });
  }

  if (sub === "evo-path") {
    const name = interaction.options.getString("name", true)!;
    const pokemon = await pokehelper.findPokemon(name);

    if (!pokemon) {
      return interaction.editReply(
        `Pokémon species "${name}" could not be found!`,
      );
    }

    const evoPath = await pokehelper.getEvolutionPath(name);

    const evoEmbeds = [];
    for (const evoName of evoPath) {
      const pokemon = await pokehelper.findPokemon(evoName);
      evoEmbeds.push(await pokehelper.pokeEmbedCreate(pokemon));
    }

    return interaction.editReply({
      embeds: evoEmbeds,
    });
  }
};
