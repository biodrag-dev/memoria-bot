import { Interaction } from "discord.js";
import * as qotdHelper from "../../helpers/qotdHelper";


export default async function handleButtonInteraction(interaction: Interaction) {
    if (!interaction.isButton()) return;

    const [key, id, status] = interaction.customId.split(":");

    if (key != "QOTDsuggest") {
        return;
    }
    const embed = interaction.message.embeds[0]!;
    qotdHelper.updateSuggestionStatus(interaction.message, id!, embed, status as qotdHelper.questionStatus);
}
