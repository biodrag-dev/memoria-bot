import { EmbedBuilder, GuildMember, Interaction } from "discord.js";
import * as ticketHelper from "../../helpers/ticketHelper";

export default async function handleButtonInteraction(
  interaction: Interaction,
) {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("closeTicket")) {
    const [custom, id] = interaction.customId.split(":");
    interaction.reply({ephemeral: true, content: `closing thread...`})
    return ticketHelper.closeTicket(interaction.client, id!, interaction.user.id);
  }

  if (interaction.customId != "createTicket") return;

  if (ticketHelper.canOpenTicket(interaction.user.id) === false) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `You already have a ticket! Please reuse that one or close it.

${ticketHelper.getTicketLink(interaction.user.id)}`,
          )
          .setColor("#8FE3A0"),
      ],
      ephemeral: true,
    });
  } else {
    ticketHelper.createTicket(
      interaction.client,
      interaction.member as GuildMember,
    );
  }
}
