import type {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
} from "discord.js";

export default async function (interaction: Interaction) {
  if (interaction.isButton()) {
    console.log("button pressed");
    switch (interaction.customId) {
      case "submit-confirm":
        // Save to JSON/database here

        await interaction.update({
          content: "✅ Character submitted successfully!",
          embeds: [],
          components: [],
        });
        break;

      case "submit-cancel":
        await interaction.update({
          content: "❌ Submission cancelled.",
          embeds: [],
          components: [],
        });
        break;
    }
  }
}
