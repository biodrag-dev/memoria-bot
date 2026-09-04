import { EventHandler } from "commandkit";

import * as starboardHelper from "../../helpers/starboardHelper";
import { Message } from "discord.js";

const handler: EventHandler<"messageReactionRemove"> = async (
  reaction,
  user,
) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      console.error(err);
      return;
    }
  }

  if (reaction.emoji.name !== "⭐") return;

  starboardHelper.removeStar(
    reaction.client,
    reaction.count!,
    reaction.message as Message,
  );
};

export default handler;
