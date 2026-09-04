import { EventHandler } from "commandkit";

import * as proxyHelper from "../../helpers/proxyHelper";
import { Message } from "discord.js";

const handler: EventHandler<"messageReactionAdd"> = async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      console.error(err);
      return;
    }
  }

  if (reaction.emoji.name !== "❌") return;

  proxyHelper.proxyDelete(user.id, reaction.message as Message);
};

export default handler;
