interface Ticket {
  ongoing: boolean;
  ticketThreadID: string;
  ticketLogID: string;
}

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  GuildMember,
  Message,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
} from "discord.js";
import fs from "fs";
import path from "path";

const jsonsPath = path.resolve(__dirname, "../../../jsons");
import { replyText } from "./proxyHelper";

const ticketDex: Record<string, Ticket> = loadTickets()!;

function loadTickets() {
  const data = fs.readFileSync(`${jsonsPath}/tickets.json`, "utf8");
  return JSON.parse(data) as Record<string, Ticket>;
}

function saveTickets() {
  fs.writeFileSync(
    `${jsonsPath}/tickets.json`,
    JSON.stringify(ticketDex, null, 2),
    "utf8",
  );
}

export function canOpenTicket(user: string) {
  if (ticketDex[user] && ticketDex[user].ongoing === true) {
    return false;
  }
  return true;
}

export function getTicketLink(user: string) {
  return `https://discord.com/channels/${process.env.GUILD_ID}/${ticketDex[user]?.ticketThreadID}`;
}

export async function createTicket(client: Client, member: GuildMember) {
  const tickets = (await client.channels.fetch(
    `${process.env.TICKET_CHANNEL}`,
  )) as TextChannel;
  const thread = await tickets.threads.create({
    name: `${member.displayName}'s ticket!`,
    type: ChannelType.PrivateThread,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
  });

  thread.send({
    content: `<@${member.user.id}>`,
    embeds: [
      new EmbedBuilder()
        .setDescription(
          "Thanks for opening a ticket! Please describe what you are here for. Staff will be here to help shortly!",
        )
        .setColor("#8FE3A0"),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`closeTicket:${member.user.id}`)
          .setLabel(`Close the ticket!`)
          .setStyle(ButtonStyle.Danger),
      ),
    ],
  });

  ticketDex[member.user.id] = {
    ongoing: true,
    ticketThreadID: thread.id,
    ticketLogID: await createTicketLog(client, member),
  };
  saveTickets();
}

async function createTicketLog(client: Client, member: GuildMember) {
  const tickets = (await client.channels.fetch(
    `${process.env.TICKET_LOG}`,
  )) as TextChannel;

  const msg = await tickets.send({
    content: `loading...`,
  });
  const thread = await msg.startThread({
    name: `${member.user.username}'s ticket!`,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
  });

  msg.edit({
    content: ``,
    embeds: [
      new EmbedBuilder()
        .setTitle(`${member.user.username}'s ticket`)
        .addFields(
          {
            name: `**User**`,
            value: `<@${member.user.id}>`,
            inline: true,
          },
          {
            name: `**Created At**`,
            value: `<t:${Math.floor(new Date().getTime() / 1000)}:F>`,
            inline: true,
          },
          {
            name: `**Thread**`,
            value: `${thread.url}`,
            inline: true,
          },
        )
        .setAuthor({
          name: member.user.username,
          iconURL: member.displayAvatarURL(),
        })
        .setColor("#8FE3A0"),
    ],
  });
  thread.send({
    content: ``,
    embeds: [
      new EmbedBuilder()
        .setDescription(
          "Thanks for opening a ticket! Please describe what you are here for. Staff will be here to help shortly!",
        )
        .setColor("#8FE3A0"),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`closeTicket:${member.user.id}`)
          .setLabel(`Close the ticket!`)
          .setStyle(ButtonStyle.Danger),
      ),
    ],
  });
  return thread.id;
}

// message to ticket log
export async function sendToTicketLog(message: Message) {
  const tickets = (await message.client.channels.fetch(
    `${process.env.TICKET_LOG}`,
  )) as TextChannel;

  const webhook = await message.client.fetchWebhook("1546756355954708491");

  var reply;
  if (message.reference) {
    reply = replyText(await message.fetchReference());
  }
  const content = `${reply ?? ``}${message.content}`;

  const files = [...message.attachments.values()].map((attachment) => ({
    attachment: attachment.url,
    name: attachment.name ?? "image.png",
  }));

  await webhook.send({
    content: content,
    username: message.member!.displayName,
    avatarURL: message.member!.displayAvatarURL(),
    files,
    threadId: linkTicketLogToTicket(message.channel.id),
  });

  tickets.send({});
}

// ticket log to message
export async function sendToTicket(message: Message) {
  const tickets = (await message.client.channels.fetch(
    `${process.env.TICKET_CHANNEL}`,
  )) as TextChannel;

  const ticketID = linkTicketToTicketLog(message.channel.id);
  const thread = await tickets.threads.fetch(ticketID);

  var reply;
  if (message.reference) {
    reply = replyText(await message.fetchReference());
  }
  const content = `${reply ?? ``}${message.content ?? ``}`;

  const files = [...message.attachments.values()].map((attachment) => ({
    attachment: attachment.url,
    name: attachment.name ?? "image.png",
  }));

  thread?.send({
    content,
    files: files,
  });
}
//returns the linked ticket to the ticket log
export function linkTicketToTicketLog(ticketLogID: string) {
  const ticket = Object.values(ticketDex).find((ticket) => {
    return ticket.ticketLogID === ticketLogID;
  })!;

  return ticket.ticketThreadID;
}

export function linkTicketLogToTicket(ticketID: string) {
  const ticket = Object.values(ticketDex).find((ticket) => {
    return ticket.ticketThreadID === ticketID;
  })!;

  return ticket.ticketLogID;
}

export async function closeTicket(
  client: Client,
  user: string,
  closedBy: string,
) {
  const tickets = (await client.channels.fetch(
    `${process.env.TICKET_CHANNEL}`,
  )) as TextChannel;
  const ticketLog = (await client.channels.fetch(
    `${process.env.TICKET_LOG}`,
  )) as TextChannel;

  if (!ticketDex[user]) {
    return;
  }

  const thread = (await tickets.threads.fetch(
    ticketDex[user]!.ticketThreadID,
  )) as ThreadChannel;
  const ticketThread = (await ticketLog.threads.fetch(
    ticketDex[user]!.ticketLogID,
  )) as ThreadChannel;

  if (thread.archived === false) {
    await thread.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Ticket closed by <@${closedBy}>!`)
          .setColor("#8FE3A0"),
      ],
    });
    await ticketThread.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Ticket closed by <@${closedBy}>!`)
          .setColor("#8FE3A0"),
      ],
    });
    thread.setLocked(true);
    ticketThread.setLocked(true);
    thread.setArchived(true);
    ticketThread.setArchived(true);
  }
  ticketDex[user].ongoing = false;
  saveTickets();
}
