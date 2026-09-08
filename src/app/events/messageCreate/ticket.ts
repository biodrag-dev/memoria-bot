import type { EventHandler } from "commandkit";
import * as ticketHelper from "../../helpers/ticketHelper";
import { TextChannel, ThreadChannel } from "discord.js";

const handler: EventHandler<"messageCreate"> = async (message) => {
  if (message.author.bot || message.webhookId) return;
  if (!message.guild || !message.channel.isThread) return;
  const thread = message.channel as ThreadChannel;
  const parentChannel = thread.parent as TextChannel;

  if (parentChannel.id == `${process.env.TICKET_CHANNEL}`) {
    await ticketHelper.sendToTicketLog(message);
  } else if (parentChannel.id == `${process.env.TICKET_LOG}`) {
    await ticketHelper.sendToTicket(message);
  }
};

export default handler;
