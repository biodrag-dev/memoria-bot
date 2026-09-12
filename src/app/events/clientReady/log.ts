import type { EventHandler } from "commandkit";
import { Logger } from "commandkit/logger";
import { startScheduler } from "../../../scheduler.js";
import * as embedHelper from "../../helpers/embedHelper";
import * as inventoryHelper from "../../helpers/extraHelpers/inventoryHelper.js";
import * as qotdHelper from "../../helpers/qotdHelper";
import * as starterQuizHelper from "../../helpers/extraHelpers/starterQuizHelper";
import * as partnerHelper from "../../helpers/extraHelpers/partnerHelper";

const handler: EventHandler<"clientReady"> = async (client) => {
  startScheduler(client);
  await embedHelper.updateAllEmbeds(client);
  client.user.setActivity({ name: "Watching over the Archives..." });
  client.user.setStatus("idle");
  Logger.info(`Logged in as ${client.user.username}!`);

  client.addListener("interactionCreate", (interaction) => {
    if (interaction.isButton()) {
      console.log(interaction.customId);
      inventoryHelper.handleAdminInventoryPage(interaction);
      inventoryHelper.handleCharacterInventoryPage(interaction);
      qotdHelper.updateQOTDStatus(interaction);
      inventoryHelper.handleShopPage(interaction);
    }
  });

  client.addListener("interactionCreate", (interaction) => {
    if (interaction.isStringSelectMenu()) {
      console.log(interaction.customId);
      starterQuizHelper.starterQuizHandler(interaction);
      partnerHelper.feedPartner(interaction);
      partnerHelper.evolvePartner(interaction);
    }
  });
};

export default handler;
