import type { EventHandler } from "commandkit";
import { Logger } from "commandkit/logger";
import { startScheduler } from "../../../scheduler.js";

const handler: EventHandler<"clientReady"> = async (client) => {
  Logger.info(`Logged in as ${client.user.username}!`);
  startScheduler(client);
  client.user.setActivity({ name: "Watching over the Archives..." });
  client.user.setStatus("idle");

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    console.log("AUTOCOMPLETE");
    console.log(interaction.commandName);
    console.log(interaction.options.getFocused(true));

    await interaction.respond([{ name: "test", value: "test" }]);
  });
};

export default handler;
