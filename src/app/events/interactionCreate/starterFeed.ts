import * as starterQuizHelper from "../../helpers/starterQuizHelper";
import * as partnerHelper from "../../helpers/partnerHelper";

export default async function handleQuizInteraction(interaction: any) {
  if (!interaction.isStringSelectMenu()) return;

  const ids = interaction.customId.split(":");

  if (ids[0] != "starter_feeding") {
    return;
  }

  if (interaction.member.id != ids[1]) {
    await interaction.reply({
      content:
        "Hey! Don't feed other trainer's pokemon without their permission, that's rude!",
      ephemeral: true,
    });
    return;
  }

  const partner = await partnerHelper.getPartner(ids[1]);

  // Prevent old dropdowns from being used
  if (partner?.canFeed !== true) {
    return interaction.update({
      content: `You've already fed them today!`,
      embed: [],
      ephemeral: true,
    });
  }

  const berry = interaction.values[0];
  const msg = await partnerHelper.feedBerry(interaction.user.id, berry);

  await interaction.update(msg);
}
