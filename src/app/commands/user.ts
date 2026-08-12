import type {
  ChatInputCommand,
  CommandData,
  CommandMetadata,
} from "commandkit";
import { EmbedBuilder } from "discord.js";

import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionContextType,
} from "discord.js";

import * as characterHelper from "../helpers/characterHelper";

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("set-accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("set-decline")
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger),
);

const evoRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("evolve-accept")
    .setLabel("Proceed")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("evolve-decline")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger),
);

export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

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
              name: "name",
              description: "Whose partner are you viewing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },

        {
          name: "edit",
          description: "Edit something about your partner",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Whose partner are you editing?",
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
                { name: "Nickname", value: "nickname" },
                { name: "Bio", value: "bio" },
              ],
            },
            {
              name: "data",
              description: "What are you setting?",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "set",
          description:
            "Set something about your partner (These cannot be changed after being set)",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Whose partner are you editing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "field",
              description: "Which field are you setting?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "data",
              description: "What are you setting?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },

        {
          name: "dex-entry",
          description: "View your partner Pokémon's dex entry",
          type: ApplicationCommandOptionType.Subcommand,

          options: [
            {
              name: "name",
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
              name: "name",
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
          name: "name",
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
          name: "name",
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
          name: "name",
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
  const interaction = ctx.interaction;
  const focused = interaction.options.getFocused(true);
  const names = await characterHelper.getCharacterNames(interaction.user.id);

  if (interaction.options.getSubcommand() == "set") {
    const characterId = interaction.options.getString("name", false);

    if (focused.name === "field") {
      if (!characterId) {
        return await interaction.respond([]);
      } else {
        const fields = await characterHelper.getSetPartnerFields(
          interaction.user.id,
          characterId,
        );
        return await interaction.respond(fields);
      }
    }

    if (focused.name === "data") {
      const fieldName = interaction.options.getString("field", false);
      if (!characterId || !fieldName) {
        console.log("Nothing");
        return await interaction.respond([]);
      } else {
        switch (fieldName) {
          case "nature":
            const natures = await characterHelper.getNatures();
            return await interaction.respond(natures);
          case "ability":
            const abilities = await characterHelper.getAbilities(
              interaction.user.id,
              characterId,
            );
            return await interaction.respond(abilities);
          case "gender":
            const genders = await characterHelper.getGenders(
              interaction.user.id,
              characterId,
            );
            return await interaction.respond(genders);
        }
      }
    }
  }

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

  const group = interaction.options.getSubcommandGroup();

  const sub = interaction.options.getSubcommand();

  if (group === "partner") {
    switch (sub) {
      case "view": {
        const character = interaction.options.getString("name")!;
        const embed = await characterHelper.getPartnerEmbed(
          interaction.user.id,
          character,
        );
        return interaction.reply({
          embeds: [embed],
        });
      }

      case "dex-entry": {
        const character = interaction.options.getString("name", true);

        const embed = await characterHelper.getPartnerDexEmbed(
          interaction.user.id,
          character,
        );
        return interaction.reply({ embeds: [embed] });
      }

      case "edit": {
        const character = interaction.options.getString("name", true);
        const field = interaction.options.getString("field", true);
        const data = interaction.options.getString("data", true);

        await characterHelper.editPartner(
          interaction.user.id,
          character,
          field,
          data,
        );
        const embed = await characterHelper.getPartnerEmbed(
          interaction.user.id,
          character,
        );

        characterHelper.updateCharaForumPost(
          interaction.user.id,
          interaction.options.getString("name", true),
          interaction.client,
        );
        return await interaction.reply({
          content: `Partner edited successfully!`,
          embeds: [embed],
          ephemeral: true,
        });
      }
      case "evolve": {
        const character = interaction.options.getString("name", true);

        const embed = new EmbedBuilder();
        if (
          (await characterHelper.canEvolve(
            interaction.user.id,
            character,
            embed,
          )) === true
        ) {
          const msg = await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [evoRow],
          });

          const collector = msg.createMessageComponentCollector({
            time: 30_000,
          });

          collector.on("collect", async (button) => {
            if (button.customId === "evolve-accept") {
              await characterHelper.evolvePartner(
                interaction.user.id,
                character,
                embed,
              );
              characterHelper.updateCharaForumPost(
                interaction.user.id,
                interaction.options.getString("name", true),
                interaction.client,
              );
              await button.update({
                content: ``,
                embeds: [embed],
                components: [],
              });
              collector.stop();
            }

            if (button.customId === "evolve-decline") {
              embed.setDescription(`Huh? Your partner stopped evolving!`);
              embed.setColor("Red");
              await button.update({
                embeds: [embed],
                components: [],
              });
              collector.stop();
            }
          });
        }
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
      case "set": {
        const character = interaction.options.getString("name", true);
        const field = interaction.options.getString("field", true);
        const data = interaction.options.getString("data", true);

        var embed = new EmbedBuilder();
        embed
          .setDescription(
            `Are you sure you want to set ${character}'s partner's **${field.charAt(0).toUpperCase() + field.slice(1)}** to **${field == "ability" ? `Slot ${data}` : field == "nature" ? characterHelper.getNatureFromValue(data) : data}**? Warning: This cannot be changed in the future!`,
          )
          .setColor("Yellow");

        const msg = await interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
        const collector = msg.createMessageComponentCollector({
          time: 30_000,
        });

        collector.on("collect", async (button) => {
          if (button.customId === "set-accept") {
            await characterHelper.editPartner(
              interaction.user.id,
              character,
              field,
              data,
            );
            embed = await characterHelper.getPartnerEmbed(
              interaction.user.id,
              character,
            );
            characterHelper.updateCharaForumPost(
              interaction.user.id,
              interaction.options.getString("name", true),
              interaction.client,
            );
            await button.update({
              content: `Edited succesfully!`,
              embeds: [embed],
              components: [],
            });
            collector.stop();
          }

          if (button.customId === "set-decline") {
            embed.setDescription(`Setting cancelled.`);
            embed.setColor("Red");
            await button.update({
              embeds: [embed],
              components: [],
            });

            collector.stop();
          }
        });
      }
    }
  } else if (sub === "view") {
    const character = interaction.options.getString("name", true);
    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      character,
    );

    return interaction.reply({
      embeds: [embed],
    });
  } else if (sub === "edit") {
    await characterHelper.editCharacter(
      interaction.user.id,
      interaction.options.getString("name", true),
      interaction.options.getString("field", true),
      interaction.options.getString("information", true),
    );

    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      interaction.options.getString("name", true),
    );

    characterHelper.updateCharaForumPost(
      interaction.user.id,
      interaction.options.getString("name", true),
      interaction.client,
    );

    return interaction.reply({
      content: `Your character's profile has been edited!`,
      embeds: [embed],
      ephemeral: true,
    });
  } else if (sub === "edit-image") {
    await characterHelper.editCharacter(
      interaction.user.id,
      interaction.options.getString("name", true),
      "img_link",
      interaction.options.getString("art-link", true),
    );
    await characterHelper.editCharacter(
      interaction.user.id,
      interaction.options.getString("name", true),
      "artist_credits",
      interaction.options.getString("artist-credit", true),
    );

    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      interaction.options.getString("name", true),
    );

    characterHelper.updateCharaForumPost(
      interaction.user.id,
      interaction.options.getString("name", true),
      interaction.client,
    );
    return interaction.reply({
      content: `Your character's profile has been edited!`,
      embeds: [embed],
      ephemeral: true,
    });
  }
};
