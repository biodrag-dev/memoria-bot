import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";
import type { ChatInputCommand, OnModalKitSubmit, Modal } from "commandkit";
import * as pokehelper from "../helpers/pokeHelper";
import * as submitHelper from "../helpers/submitHelper";

const favoriteStarterSelect = new StringSelectMenuBuilder()
  .setCustomId("chara-house")
  .setPlaceholder("Which trait do they embody?")
  // Modal only property on select menus to prevent submission, defaults to true
  .setRequired(true)
  .addOptions(
    // String select menu options
    new StringSelectMenuOptionBuilder()
      // Label displayed to user
      .setLabel("Victini")
      // Description of option
      .setDescription("The incarnation of might.")
      // Value returned to you in modal submission
      .setValue("Victini"),
    new StringSelectMenuOptionBuilder()
      .setLabel("Mew")
      .setDescription("The manifestation of wit.")
      .setValue("Mew"),
    new StringSelectMenuOptionBuilder()
      .setLabel("Jirachi")
      .setDescription("The embodiment of heart.")
      .setValue("Jirachi"),
  );

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("reserve-accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("reserve-decline")
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger),
);

const houseLabel = new LabelBuilder()
  .setLabel("Character House")
  .setStringSelectMenuComponent(favoriteStarterSelect);
// Set string select menu as component of the label
const charaModal = new ModalBuilder()
  .setCustomId("character-submit")
  .setTitle("Character Registration Pending...");

charaModal.addComponents(
  new TextInputBuilder()
    .setCustomId("chara-name")
    .setLabel("Character Name?")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(30)
    .setPlaceholder("Firstname Lastname"),
  houseLabel,
  new TextInputBuilder()
    .setCustomId("chara-dest")
    .setLabel("Partner Evolution Destination")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(20)
    .setPlaceholder("Charizard, Ninetales-Alola, Eevee, etc."),
  new TextInputBuilder()
    .setCustomId("chara-doc")
    .setLabel("Document Link")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100)
    .setPlaceholder("https://docs.google.com/document/d/..."),
);

export const command: CommandData = {
  name: "submit",
  description: "Submits a character for review!",
  options: [
    {
      name: "character",
      description: "Submits a character for review",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "partner-reserve",
      description: "Reserves a pokemon species for one month",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "species",
          description: "The species of the Pokémon",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const sub = interaction.options.getSubcommand();
  if (sub === "character") {
    if ((await submitHelper.hasSubmit(ctx.interaction.user.id)) === true) {
      const failEmbed = new EmbedBuilder()
        .setColor("#ce1b1b")
        .setDescription(
          `You already have an ongoing submission! Ask an admin to deny your previous submission if you really need to create a new one.`,
        );

      await ctx.interaction.reply({
        embeds: [failEmbed],
        ephemeral: true,
      });
      return;
    }
    await ctx.interaction.showModal(charaModal);
  } else if (sub === "partner-reserve") {
    const failEmbed = new EmbedBuilder().setColor("#ce1b1b");
    const pokemon = await pokehelper.findPokemon(
      interaction.options.getString("species"),
    );
    var msg;
    if (!pokemon) {
      failEmbed.setDescription(
        `Pokemon Species "**${interaction.options.getString("species")}**" could not be found! Try looking the species up with **/pokedex find** first. Some regional species use different syntax, such as "Ninetales-alola" or "Ponyta-galar"! If you need further assistance, you can ask for help in <#${process.env.QUESTIONS_CHANNEL}>!`,
      );

      await ctx.interaction.reply({
        embeds: [failEmbed],
        ephemeral: true,
      });
      return;
    }
    const displayName = pokehelper.displayName(
      interaction.options.getString("species"),
    );

    const verifyCanReserve = submitHelper.verifyCanReserve(
      interaction.user.id,
      interaction.options.getString("species"),
    );

    switch (verifyCanReserve) {
      case -2:
        failEmbed.setDescription(
          `You already have an existing reserve, which will be erased if you go through with this! Are you sure? 
          
          **${pokehelper.displayName(submitHelper.getReserveOfUser(interaction.user.id)[0])}** -> **${displayName}**`,
        );

        msg = await ctx.interaction.reply({
          embeds: [failEmbed],
          ephemeral: true,
          components: [row],
        });
        break;
      case -1:
        failEmbed.setDescription(
          `Species **${displayName}** has already been claimed or reserved!`,
        );
        await ctx.interaction.reply({
          embeds: [failEmbed],
          ephemeral: true,
        });
        break;
      case 0:
        failEmbed
          .setDescription(
            `Are you sure you want to reserve **${displayName}?** This reservation cannot be changed for a week!`,
          )
          .setColor("Green");

        msg = await ctx.interaction.reply({
          embeds: [failEmbed],
          ephemeral: true,
          components: [row],
        });
        break;
      default:
        failEmbed.setDescription(
          `You have a recent ongoing reserve! This can be changed after <t:${verifyCanReserve}:f>`,
        );

        await ctx.interaction.reply({
          embeds: [failEmbed],
          ephemeral: true,
        });
        break;
    }


    if (msg) {

      const collector = msg.createMessageComponentCollector({
        time: 30_000,
      });

      collector.on("collect", async (button) => {
        const embed = new EmbedBuilder();

        if (button.customId === "reserve-accept") {
          await submitHelper.createProperReserve(
            interaction.user.id,
            interaction.options.getString("species").toLowerCase(),
          );
          embed
            .setDescription(`Succesfully reserved ${displayName}!`)
            .setColor("Green");
          await button.update({
            embeds: [embed],
            components: [],
          });

          collector.stop();
        }

        if (button.customId === "reserve-decline") {
          embed.setDescription(`Cancelled reservation of ${displayName}.`);
          embed.setColor("Green");
          await button.update({
            embeds: [embed],
            components: [],
          });

          collector.stop();
        }
      });
    }
  }
};
