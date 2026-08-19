import * as starterQuizHelper from "../../helpers/starterQuizHelper";
import * as partnerHelper from "../../helpers/partnerHelper";

export default async function handleStarterSelection(interaction: any) {
  if (!interaction.isButton()) return;

  const ids = interaction.customId.split(":");

  if (ids[0] != "starter_select") {
    return;
  }

  const session = starterQuizHelper.getSession(ids[1]);

  if (!session) {
    return interaction.reply({
      content: `You don't have an active quiz.`,
      ephemeral: true,
    });
  }
  if (ids[2] == "reroll") {
    const results = starterQuizHelper.getResults(interaction.user.id);
    await partnerHelper.generateChoices(
      interaction.user.id,
      results[0]!,
      results[1]!,
      results[2]!,
    );
    return await interaction.update(
      await partnerHelper.getProspects(interaction.user.id),
    );
  } else if (ids[2] == "retake") {
    await partnerHelper.deleteProspects(interaction.user.id);
    return await interaction.update({
      content: `Your results have been deleted. Run **/partner view** to take the quiz again!`,
      embeds: [],
      components: [],
    });
  }

  await partnerHelper.claimPartnerProspect(interaction.user.id, ids[2]);
  const embed = await partnerHelper.getPartnerEmbed(
    interaction.user.username,
    interaction.user.id,
  );
  await interaction.update({
    content: `Congrats on your new partner!`,
    embeds: [embed],
    components: [],
  });
}
