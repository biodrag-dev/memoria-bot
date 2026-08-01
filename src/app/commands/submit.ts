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
      name: "reserve-species",
      description: "Reserves a pokemon species",
      type: ApplicationCommandOptionType.Subcommand,
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
  }else if (sub === "reserve-species"){


    
    //   collector.on("collect", async (button) => {
    //     if (button.user.id !== interaction.user.id) {
    //       embed.setDescription(`This confirmation isn't for you.`);
    //       button.reply({
    //         embeds: [embed],
    //         ephemeral: true,
    //       });
    //     }

    //     if (button.customId === "reserve-accept") {
    //       embed.setDescription(`All of <@${interaction.options.getUser("roleplayer")!.id}>'s server data has been deleted.`);
    //       await button.update({
    //         embeds: [embed],
    //         components: [],
    //       });
    //       await userHelper.deleteAll(
    //         interaction.options.getUser("roleplayer").id,
    //       );
    //       collector.stop();
    //     }

    //     if (button.customId === "reserve-decline") {
    //       embed.setDescription(`Deletion of <@${interaction.options.getUser("roleplayer")!.id}>'s characters cancelled.`);
    //       embed.setColor("Green");
    //       await button.update({
    //         embeds: [embed],
    //         components: [],
    //       });

    //       collector.stop();
    //     }
    //   });

  }


};
