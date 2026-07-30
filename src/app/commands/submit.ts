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
} from "discord.js";
import type { ChatInputCommand, OnModalKitSubmit, Modal } from "commandkit";
import * as pokehelper from "../helpers/pokeHelper";
import * as submitHelper from "../helpers/submitHelper";

const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("admin-delete-accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("admin-delete-decline")
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger),
);

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
};

export const chatInput: ChatInputCommand = async (ctx) => {

  if(await submitHelper.hasSubmit(ctx.interaction.user.id) === true){
    return;
  }
  await ctx.interaction.showModal(charaModal);
};