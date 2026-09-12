import * as characterHelper from "../../helpers/characterHelper";
import * as inventoryHelper from "../../helpers/extraHelpers/inventoryHelper";

export default async function handleQuizInteraction(interaction: any) {
  if (!interaction.isStringSelectMenu()) return;

  const [interactionId, interactionType, user, charaName, category] =
    interaction.customId.split(":");

  if (interactionId != "buy" && interactionType != "item") {
    return;
  }

  if (interaction.member.id != user) {
    await interaction.reply({
      content:
        "This isn't your store. Use **/character shop** to view the store available to your OCs!",
      ephemeral: true,
    });
    return;
  }

  const itemId = Number(interaction.values[0]);
  const character = characterHelper.getCharacter(
    interaction.user.id,
    charaName,
  );
  const price = inventoryHelper.getPrice(Number(category), itemId);
  if (price > 0 && price > character.balance) {
    return interaction.reply({
      content: `You don't have enough money to purchase this item!`,
      ephemeral: true,
    });
  }

  inventoryHelper.addItemToInventory(
    user,
    charaName,
    Number(category),
    itemId,
    1,
  );
  characterHelper.changeBalance(interaction.user.id, charaName, -price);

  const result = await inventoryHelper.getStoreEntry(
    user,
    charaName,
    Number(category),
  );

  interaction.message.edit(result);
  interaction.reply({
    content: `Purchase successful!`,
    ephemeral: true,
  });
}
