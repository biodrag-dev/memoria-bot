import type { EventHandler } from "commandkit";

import * as embedHelper from "../../helpers/embedHelper";
import * as characterHelper from "../../helpers/characterHelper";

const OOC_CATEGORIES = [
  `1527218692038070323`, //behind the scenes
  `1539374310362194061`, //behind the scenes 2
  `1527209676985471080`, //important
  `1527299515428769973`, //your voice
  `1527209676985471083`, //text channels
  `1527209676985471087`, //voice channels
  `1527277573493493770`, //chara corner
  `1536504886366183564`, //rp corner
];

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.channel.isTextBased()) return;
  if (!("parentId" in message.channel)) return;

  //if it is a tul!edit
  if (message.content.trim().toLowerCase().includes("tul!edit")) {
    return;
  }
  var mult = 2;
  //if in ooc category
  if (!OOC_CATEGORIES.includes(message.channel.parentId!)) {
    mult = 1;
  }
  const wordCount = message.content.trim().split(/\s+/).length;

  characterHelper.addExpToPartner(message.author.id, wordCount * mult);
};

export default handler;
