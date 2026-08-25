import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import * as submitHelper from "../../helpers/submitHelper";
import * as characterHelper from "../../helpers/characterHelper";

export default async function (interaction: Interaction) {
  if (interaction.isButton()) {
    if (
      interaction.customId === "reserve-accept" ||
      interaction.customId === "reserve-decline" ||
      interaction.customId === "admin-delete-accept" ||
      interaction.customId === "admin-delete-decline"
    ) {
      return;
    }
    const [action, userId, msgId] = interaction.customId.split(":");
    const channel = await interaction.client.channels.fetch(
      `${process.env.SUBMIT_LOG}`,
    ) as TextChannel;

    var reviewMsg;
    var embed;
    switch (action) {
      case "submit-confirm":
        const submission = await submitHelper.getSubmit(interaction.user.id);
        if (!submission) {
          embed = new EmbedBuilder()
            .setColor("#ce1b1b")
            .setDescription(
              `Registration Error: Submission could not be found! Temporary submissions are cleared every 30 minutes. Try again, if the issue persists ping <@1074503972037075054> for help.`,
            );
          await interaction.update({
            content: "",
            embeds: [embed],
            components: [],
          });
          break;
        }
        await submitHelper.continueSubmit(interaction.user.id);

        embed = await submitHelper.reviewEmbed(
          interaction.user.id,
          "Reviewing",
        );
        const msg = await channel.send({
          embeds: [embed],
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`admin-approve:${interaction.user.id}:${msg.id}`)
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId(`admin-decline:${interaction.user.id}:${msg.id}`)
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger),
        );

        reviewMsg = await channel.messages.fetch(`${msg.id}`);
        await msg.edit({
          embeds: [embed],
          components: [row],
        });

        const thread = await msg.startThread({
          name: `Review Thread | ${submission.name}`,
        });
        const shinyRoll = new EmbedBuilder()

          .setDescription(`🎲 **Result** | ${submission.shinyRoll}`)
          .setTitle(`Rolling for Shiny Status (1d20)...`);

        if (submission.shinyRoll == 20) {
          shinyRoll
            .setColor("#f0ed4c")
            .setFooter({ text: `Oh? Congratulations! It's a shiny!` });
        } else {
          shinyRoll
            .setColor("#3c3d3c")
            .setFooter({ text: "Better luck next time..." });
        }
        const alphaRoll = new EmbedBuilder()
          .setDescription(`🎲 **Result** | ${submission.alphaRoll} ${submission.alphaRoll === 20 ? `<:alpha:1539739148586455162>` : ``}`)
          .setTitle(`Rolling for Alpha Status (1d20)...`);
        if (submission.alphaRoll == 20) {
          alphaRoll.setColor("#f81a1a").setFooter({
            text: `Oh? Congratulations! It's an alpha!`,
          });
        } else {
          alphaRoll
            .setColor("#3c3d3c")
            .setFooter({ text: "Better luck next time..." });
        }

        await thread.send({
          content: `<@${interaction.user.id}>`,
          embeds: [shinyRoll, alphaRoll],
        });

        embed = new EmbedBuilder().setColor("#27d121")
          .setDescription(`✅ Character submitted successfully! 
            
            A small note: Do not ping staff for submissions. We’d love to get to your submission as soon as possible, but staff have busy lives too! We’ll do our best to get to every submission within a week of submission, but please be patient with us as real life responsibilities come first. 
`);
        await interaction.update({
          content: "",
          embeds: [embed],
          components: [],
        });
        break;

      case "submit-cancel":
        await submitHelper.deleteSubmit(interaction.user.id);
        embed = new EmbedBuilder()
          .setColor("#ce1b1b")
          .setDescription(`❌ Submission cancelled.`);
        await interaction.update({
          content: "",
          embeds: [embed],
          components: [],
        });
        break;

      case "admin-approve":
        if (
          !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
        ) {
          await interaction.reply({
            content: "You do not have permission to use this button.",
            ephemeral: true,
          });
          return;
        }
        reviewMsg = await channel.messages.fetch(`${msgId}`);
        embed = await submitHelper.reviewEmbed(`${userId}`, "Approved");
        await reviewMsg.edit({
          embeds: [embed],
          components: [],
        });
        await characterHelper.registerCharacter(`${userId}`, interaction.client);
        await submitHelper.deleteSubmit(`${userId}`);
        break;

      case "admin-decline":
        if (
          !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
        ) {
          await interaction.reply({
            content: "You do not have permission to use this button.",
            ephemeral: true,
          });
          return;
        }
        reviewMsg = await channel.messages.fetch(`${msgId}`);
        embed = await submitHelper.reviewEmbed(`${userId}`, "Denied");
        await reviewMsg.edit({
          embeds: [embed],
          components: [],
        });
        await submitHelper.deleteSubmit(`${userId}`);
        break;
    }
  }
}
