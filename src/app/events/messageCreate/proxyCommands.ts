import type { EventHandler } from "commandkit";
import * as proxyHelper from "../../helpers/proxyHelper";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot || message.webhookId) return;
  if (!message.guild) return;

  const isProxied = await proxyHelper.proxyCheck(
    message.author.id,
    message.channel.id,
    message
  );
  if(isProxied){
    message.delete();
  }
};

export default handler;
