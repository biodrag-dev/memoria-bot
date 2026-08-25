import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  InteractionContextType,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";
import * as characterHelper from "../helpers/characterHelper";

export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

export const command: CommandData = {
  name: "birthday",
  description: "send a msg",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "ooc",
      description: "set your own birthday!",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "set",
          description: "set your own birthday!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "month",
              description: "your birthday month!",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { value: `0`, name: `January` },
                { value: `1`, name: `February` },
                { value: `2`, name: `March` },
                { value: `3`, name: `April` },
                { value: `4`, name: `May` },
                { value: `5`, name: `June` },
                { value: `6`, name: `July` },
                { value: `7`, name: `August` },
                { value: `8`, name: `September` },
                { value: `9`, name: `October` },
                { value: `10`, name: `November` },
                { value: `11`, name: `December` },
              ],
            },
            {
              name: "date",
              description: "the day of the month!",
              type: ApplicationCommandOptionType.Number,
              required: true,
            },
          ],
        },
        {
          name: "view-month",
          description: "view ooc birthdays for the month!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "month",
              description: "the birthday month!",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { value: `0`, name: `January` },
                { value: `1`, name: `February` },
                { value: `2`, name: `March` },
                { value: `3`, name: `April` },
                { value: `4`, name: `May` },
                { value: `5`, name: `June` },
                { value: `6`, name: `July` },
                { value: `7`, name: `August` },
                { value: `8`, name: `September` },
                { value: `9`, name: `October` },
                { value: `10`, name: `November` },
                { value: `11`, name: `December` },
              ],
            },
          ],
        },
        {
          name: "view-all",
          description: "view all upcoming ooc birthdays!",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
    {
      name: "character",
      description: "character's birthday!",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "set",
          description: "set your oc's birthday!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "character",
              description: "the character you're setting!",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "month",
              description: "the oc's birthday month!",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { value: `0`, name: `January` },
                { value: `1`, name: `February` },
                { value: `2`, name: `March` },
                { value: `3`, name: `April` },
                { value: `4`, name: `May` },
                { value: `5`, name: `June` },
                { value: `6`, name: `July` },
                { value: `7`, name: `August` },
                { value: `8`, name: `September` },
                { value: `9`, name: `October` },
                { value: `10`, name: `November` },
                { value: `11`, name: `December` },
              ],
            },
            {
              name: "date",
              description: "the day of the month!",
              type: ApplicationCommandOptionType.Number,
              required: true,
            },
          ],
        },
        {
          name: "view-month",
          description: "view characters birthdays for the month!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "month",
              description: "the birthday month!",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { value: `0`, name: `January` },
                { value: `1`, name: `February` },
                { value: `2`, name: `March` },
                { value: `3`, name: `April` },
                { value: `4`, name: `May` },
                { value: `5`, name: `June` },
                { value: `6`, name: `July` },
                { value: `7`, name: `August` },
                { value: `8`, name: `September` },
                { value: `9`, name: `October` },
                { value: `10`, name: `November` },
                { value: `11`, name: `December` },
              ],
            },
          ],
        },
        {
          name: "view-all",
          description: "view all character upcoming birthdays!",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
    {
      name: "personal",
      description: "related to both yours and your characters!!",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "view-all",
          description: "view all birthdays for you and your characters!",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
  ],
};

export const autocomplete = async (ctx: any) => {
  const interaction = ctx.interaction;
  const names = await characterHelper.getCharacterNames(interaction.user.id);

  const filtered = names
    .filter((name: string) => name.toLowerCase())
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
  const month = interaction.options.getString("month", false);
  const date = interaction.options.getNumber("date", false);

  const group = interaction.options.getSubcommandGroup(false);
  const sub = interaction.options.getSubcommand(true);

  if (group === "ooc") {
    if (sub === "set") {
      return interaction.reply({
        embeds: [
          await characterHelper.setBday(
            interaction.user.id,
            Number(month),
            date!,
          ),
        ],
      });
    } else if (sub === "view-month") {
      return interaction.reply({
        embeds: [await characterHelper.getOOCMonthBirthday(Number(month))],
      });
    } else if (sub === "view-all") {
      return interaction.reply({
        embeds: [await characterHelper.getOOCAllBirthdays()],
      });
    }
  } else if (group === "character") {
    if (sub === "set") {
      const character = interaction.options.getString("character", true);
      return interaction.reply({
        embeds: [
          await characterHelper.setCharaBday(
            interaction.user.id,
            character,
            Number(month),
            date!,
          ),
        ],
      });
    } else if (sub === "view-month") {
      return interaction.reply({
        embeds: [await characterHelper.getCharaMonthBdays(Number(month))],
      });
    } else if (sub === "view-all") {
      return interaction.reply({
        embeds: [await characterHelper.getCharaAllBdays()],
      });
    }
  }else if (group === "personal"){
          return interaction.reply({
        embeds: [await characterHelper.getAllPersonalBdays(interaction.client, interaction.user.id)],
      });
  }
};
