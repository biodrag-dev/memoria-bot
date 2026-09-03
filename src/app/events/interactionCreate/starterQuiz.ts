import * as starterQuizHelper from "../../helpers/extraHelpers/starterQuizHelper";
import * as partnerHelper from "../../helpers/extraHelpers/partnerHelper";

export default async function handleQuizInteraction(interaction: any) {
  if (!interaction.isStringSelectMenu()) return;

  const ids = interaction.customId.split(":");

  if (ids[0] != "starter_quiz") {
    return;
  }

  const session = starterQuizHelper.getSession(ids[1]);

  if (!session) {
    return interaction.reply({
      content: `You don't have an active quiz.`,
      ephemeral: true,
    });
  }
  // Prevent old dropdowns from being used
  if (Number(ids[2]) !== session.questionIndex) {
    return interaction.reply({
      content: `That question has already been answered.`,
      ephemeral: true,
    });
  }

  const answer = interaction.values[0];

  starterQuizHelper.submitQuestion(interaction.user.id, answer);

  // Finished?
  if (ids[2] >= 9) {
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
  }

  await interaction.update(
    starterQuizHelper.createQuestionMessage(interaction.user.id),
  );
}
