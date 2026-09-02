import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionContextType,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";
export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

import * as characterHelper from "../helpers/characterHelper";
import * as partnerHelper from "../helpers/partnerHelper";
import * as pokeHelper from "../helpers/pokeHelper";
import * as boosterHelper from "../helpers/boosterHelper";

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("shiny")
    .setLabel("Shiny")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("size")
    .setLabel("Size")
    .setStyle(ButtonStyle.Success),
);

export const command: CommandData = {
  name: "booster",
  description: "booster only commands!",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "reroll",
      description: "rerolls an in-character partner data",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "irp",
          description: "rerolls an in-character partner data",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Whose partner are you editing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: "ooc",
          description: "rerolls ooc partner data",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
    {
      name: "role",
      description: "changes your color role",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "name",
          description: "name of the custom role",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "name of the custom role",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "color",
          description: "changes the color of your custom role",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "hex-code",
              description: "primary hex code",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "hex-code2",
              description: "secondary hex code for gradient roles",
              type: ApplicationCommandOptionType.String,
            },
          ],
        },
      ],
    },
  ],
};

export const autocomplete = async (ctx: any) => {
  const interaction = ctx.interaction;
  //const focused = interaction.options.getFocused(true);
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
  const user = await interaction.guild!.members.fetch(`${interaction.user.id}`);
  if (
    !user.roles.cache.has(`${process.env.BOOSTER_ROLE}`) &&
    user.id != `1074503972037075054`
  ) {
    return interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
  }

  const group = interaction.options.getSubcommandGroup(false);
  const sub = interaction.options.getSubcommand(true);

  if (group === "reroll") {
    if (sub === "ooc") {
      var rerolls = await boosterHelper.getRerolls(interaction.user.id);

      if ((await partnerHelper.getPartner(interaction.user.id)) === undefined) {
        var embed = new EmbedBuilder()
          .setTitle(`${interaction.user.username} | Booster Perks`)
          .setDescription(
            `**Remaining Monthly Rerolls** | ${rerolls}/3

You don't have a partner pokemon yet! Use **/partner view** to get one!`,
          )
          .setColor("Red");
        return await interaction.reply({
          embeds: [embed],
          components: [],
          ephemeral: true,
        });
      }
      const partner = await partnerHelper.getOOCPartner(interaction.user.id);
      const img = await pokeHelper.getSprite(
        partner?.species!,
        partner?.gender,
        partner?.shiny!,
      );
      var embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} | Booster Perks`)
        .setDescription(
          `**Remaining Monthly Rerolls** | ${rerolls}/3

${rerolls === 0 ? `You're all out of rerolls for the month!` : `Would you like to reroll an aspect of your partner?`}`,
        )
        .setColor("Yellow")
        .setThumbnail(img);

      const msg = await interaction.reply({
        embeds: [embed],
        components: rerolls === 0 ? [] : [row],
        ephemeral: true,
      });
      const collector = msg.createMessageComponentCollector({
        time: 30_000,
      });
      collector.on("collect", async (button) => {
        const rerollEmbed = await boosterHelper.rerollOOC(
          interaction.user.id,
          button.customId,
        );
        await button.update({
          content: ``,
          embeds: [rerollEmbed],
          components: [],
        });
        collector.stop();
      });
    } else if (sub === "irp") {
      const character = interaction.options.getString("name", true);

      var rerolls = await boosterHelper.getRerolls(interaction.user.id);
      var embed = new EmbedBuilder();
      embed
        .setTitle(`${character} | Booster Perks`)
        .setDescription(
          `**Remaining Monthly Rerolls** | ${rerolls}/3

${rerolls === 0 ? `You're all out of rerolls for the month!` : `Would you like to reroll an aspect of your partner?`}`,
        )
        .setColor("Yellow")
        .setThumbnail(
          await characterHelper.getPartnerSprite(
            interaction.user.id,
            character,
          ),
        );

      const msg = await interaction.reply({
        embeds: [embed],
        components: rerolls === 0 ? [] : [row],
        ephemeral: true,
      });
      const collector = msg.createMessageComponentCollector({
        time: 30_000,
      });
      collector.on("collect", async (button) => {
        const rerollEmbed = await boosterHelper.rerollIRP(
          interaction.user.id,
          character,
          button.customId,
        );
        characterHelper.updateCharaForumPost(
          interaction.user.id,
          interaction.options.getString("name", true),
          interaction.client,
        );
        await button.update({
          content: ``,
          embeds: [rerollEmbed],
          components: [],
        });
        collector.stop();
      });
    }
  } else if (group === "role") {
    if (sub === "name") {
      const name = interaction.options.getString("name", true);
      boosterHelper.boosterName(
        interaction.client,
        interaction.user.id,
        name,
      );
      return interaction.reply({
        content: "Your role's name has been successfully changed!",
        ephemeral: true,
      });
    } else if (sub === "color") {
      const color1 = interaction.options.getString("hex-code", true);
      const color2 = interaction.options.getString("hex-code2", false);
      if (
        color2 &&
        !interaction.guild!.features.includes("ENHANCED_ROLE_COLORS")
      ) {
        return interaction.reply({
          content:
            "This server does not have gradient roles unlocked yet! Why not contribute towards that? :]",
          ephemeral: true,
        });
      }

      const results = await boosterHelper.boosterColor(
        interaction.client,
        interaction.user.id,
        color1,
        color2,
      );
      return interaction.reply({
        content: results,
        ephemeral: true,
      });
    }
  }
};
