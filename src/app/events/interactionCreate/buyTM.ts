import * as partnerHelper from "../../helpers/extraHelpers/partnerHelper";
import * as characterHelper from "../../helpers/characterHelper";

export default async function handleQuizInteraction(interaction: any) {
    if (!interaction.isStringSelectMenu()) return;

    const ids = interaction.customId.split(":");

    if (ids[0] != "buy" || ids[1] != "tm") {
        return;
    }


    if (interaction.member.id != ids[2]) {
        await interaction.reply({
            content:
                "This isn't your store. Use **/character shop** to view the daily personalized TMs available to your OCs!",
            ephemeral: true,
        });
        return;
    }


    const [charaName, moveName, moveID, price] = interaction.values[0].split(":");
    const character = await characterHelper.getCharacter(interaction.user.id, charaName)

    if (price > character.balance) {
        return interaction.reply({
            content: `You don't have enough money to purchase this TM!`,
            ephemeral: true,
        })
    }

    if (await characterHelper.knowsMove(interaction.user.id, charaName, moveName)) {
        return interaction.reply({
            content: `Your partner already knows this move!`,
            ephemeral: true,
        })
    }

    if (character.shoppingArray?.find((entry) => entry.id === moveID)) {
        return interaction.reply({
            content: `This store entry is outdated! Refresh again with **/character store** to view the updated store.`,
            ephemeral: true,
        })
    }

    await characterHelper.teachMove(interaction.client, interaction.user.id, charaName, moveName);
    await characterHelper.changeBalance(interaction.user.id, charaName, -price);
    interaction.reply({
        content: `Purchase successful!`,
        ephemeral: true,
    })
}
