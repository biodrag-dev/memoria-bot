// import type {
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   Interaction,
// } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  EmbedBuilder,
} from "discord.js";
import * as pokehelper from "../../helpers/pokeHelper";
import * as submitHelper from "../../helpers/submitHelper";

require("dotenv").config();

const houseColors: Record<string, string> = {
  Victini: "#ce1b1b",
  Jirachi: "#fadb2c",
  Mew: "#3473fa",
};

export default async function (interaction: Interaction) {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId == "character-submit") {
    console.log(interaction.fields);
    const name = interaction.fields.getTextInputValue("chara-name");
    const house = interaction.fields.fields.get("chara-house").values[0];
    const dest = interaction.fields.getTextInputValue("chara-dest");
    const doc = interaction.fields.getTextInputValue("chara-doc");

    //checks if pokemon exists
    const pokemon = await pokehelper.findPokemon(dest);
    if (!pokemon) {
      const failEmbed = new EmbedBuilder()
        .setColor("#ce1b1b")
        .setDescription(
          `Registration Error: Pokemon Species "${await submitHelper.toProperCase(dest)}" could not be found! Try looking the species up with **/pokedex find** first. Some regional species use different syntax, such as "Ninetales-alola" or "Ponyta-galar"! If you need further assistance, you can ask for help in ${process.env.QUESTIONS_CHANNEL}!`,
        );

      await interaction.reply({
        embeds: [failEmbed],
        ephemeral: true,
      });
      return;
    }

    //checks if an existing claim is on the destination
    const evoCheck = await submitHelper.checkDestination(
      interaction.user.id,
      dest.toLowerCase(),
    );
    if (evoCheck == false) {
      const failEmbed = new EmbedBuilder()
        .setColor("#ce1b1b")
        .setDescription(
          `Registration Error: Pokemon "${await submitHelper.toProperCase(dest)}" has already been claimed!`,
        );

      await interaction.reply({
        embeds: [failEmbed],
        ephemeral: true,
      });
      return;
    }

    //checks if user has any other existing reservations
    const reserveCheck = await submitHelper.getReserve(interaction.user.id);
    console.log(reserveCheck.length);
    if (reserveCheck.length != 0 && reserveCheck[0] != dest.toLowerCase()) {
      const failEmbed = new EmbedBuilder()
        .setColor("#ce1b1b")
        .setDescription(
          `Registration Error: You already have an existing reservation for ${await submitHelper.toProperCase(reserveCheck[0])}! Reservations last for a month, but can be changed after a week.`,
        );

      await interaction.reply({
        embeds: [failEmbed],
        ephemeral: true,
      });
      return;
    }

    const color = houseColors[house] ?? "#221e1e";

    const embed = new EmbedBuilder()
      .setTitle(`Character Registration | ${name}`)
      .setThumbnail(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      )
      .setColor(color)
      .setDescription(
        `**House** | ${house}\n**Evolutionary Destination** | ${dest}\n**Document Link**\n${doc}`,
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("submit-confirm")
        .setLabel("Submit")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("submit-cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary),
    );

    const channel = await interaction.client.channels.fetch(
      process.env.SUBMIT_LOG,
    );

    channel.send({
      content: `<@${interaction.user.id}> has submitted a character!`,
      embeds: [embed],
      ephemeral: true,
    });

    await interaction.reply({
      content: `Please confirm your registration details. This cannot be changed after clicking 'Submit'!`,
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  }
}
