import * as characterHelper from "../../helpers/characterHelper";

export default async function handleQuizInteraction(interaction: any) {
  if (!interaction.isStringSelectMenu()) return;

  const ids = interaction.customId.split(":");

  if (ids[0] != "starter_evolution") {
    return;
  }
  
  const evolution = interaction.values[0];
  const msg = await characterHelper.changeSpecies(interaction.user.id, evolution);

  await interaction.update(msg);
}
