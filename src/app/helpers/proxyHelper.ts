import fs from "fs/promises";
import path from "path";
import {
  Client,
  ColorResolvable,
  EmbedBuilder,
  Message,
  parseWebhookURL,
  Webhook,
  WebhookClient,
} from "discord.js";

const jsonsPath = path.resolve(__dirname, "../../../jsons");
let proxyDex: Record<string, UserProxies>;

export interface Proxies {
  character: ProxyData;
  partner: ProxyData;
}

export interface ProxyData {
  prefix: string;
  nick: string;
  pfp_link?: string;
  msgCount: number;
  isNarrator: boolean;
  embedColor?: ColorResolvable;
}

export interface UserProxies {
  narrator: ProxyData;
  proxies: Record<string, Proxies>;
}

async function loadProxies() {
  if (!proxyDex) {
    const data = await fs.readFile(`${jsonsPath}/proxyDex.json`, "utf8");

    proxyDex = JSON.parse(data) as Record<string, UserProxies>;
  }
}

async function saveProxies() {
  await fs.writeFile(
    `${jsonsPath}/proxyDex.json`,
    JSON.stringify(proxyDex, null, 2),
    "utf8",
  );
}

export async function proxyCheck(
  id: string,
  channel: string,
  message: Message,
): Promise<boolean> {
  await loadProxies();
  if (!proxyDex[id]) {
    return false;
  }
  const proxy = isProxy(id, message.content);
  if (proxy === null) {
    console.log("No proxy detected!");
    return false;
  } else {
    console.log("Proxy detected!");

    if (proxy[0] != "Narrator") {
      //character helper
      //proxy[0]
    }
    if (message.reference) {
      const original = await message.fetchReference();
      if (original.author.username == proxy[1].nick) {
        await editWebhook(
          message.client,
          proxy[1],
          message.content.replace(proxy[1].prefix, ""),
          message,
        );

        return true;
      }
    }
    sendWebhook(
      message.client,
      proxy[1],
      message.content.replace(proxy[1].prefix, ""),
      channel,
    );
    proxy[1].msgCount++;
    await saveProxies();
    return true;
  }
}

export function isProxy(
  id: string,
  content: string,
): [string, ProxyData] | null {
  if (content.startsWith(proxyDex[id]!.narrator.prefix)) {
    return ["Narrator", proxyDex[id]!.narrator];
  } else {
    for (const [character, proxies] of Object.entries(proxyDex[id]!.proxies)) {
      if (content.startsWith(proxies.character.prefix)) {
        return [character, proxies.character];
      } else if (content.startsWith(proxies.partner.prefix)) {
        return [character, proxies.partner];
      }
    }
  }

  return null;
}

export async function sendWebhook(
  client: Client,
  data: ProxyData,
  content: string,
  channel: string,
) {
  const webhook = await client.fetchWebhook("1544773325082071121");
  if (!webhook) {
    return;
  }

  await webhook.edit({ channel: channel });

  if (data.isNarrator) {
    const embed = new EmbedBuilder().setDescription(content);
    if (data.embedColor) embed.setColor(data.embedColor);

    webhook.send({
      username: data?.nick,
      avatarURL: data?.pfp_link,
      embeds: [embed],
    });
  } else {
    webhook.send({
      content: content,
      username: data?.nick,
      avatarURL: data?.pfp_link,
      embeds: [],
    });
  }
}

export async function editWebhook(
  client: Client,
  data: ProxyData,
  content: string,
  message: Message,
) {
  const webhook = await client.fetchWebhook("1544773325082071121");
  if (!webhook) {
    return;
  }

  if (data.isNarrator) {
    const embed = new EmbedBuilder().setDescription(content);
    if (data.embedColor) embed.setColor(data.embedColor);

    await webhook.editMessage(message.reference?.messageId!, {
      embeds: [embed],
    });
  } else {
    await webhook.editMessage(message.reference?.messageId!, { content: content, embeds: [] });
  }
}

export async function addCharacter(
  id: string,
  username: string,
  name: string,
  partner: string,
) {
  await loadProxies();
  if (!proxyDex[id]) {
    proxyDex[id] = {
      narrator: {
        prefix: "narr:",
        msgCount: 0,
        nick: `${username}'s narrator`,
        isNarrator: true,
      },
      proxies: {},
    };
  }
  proxyDex[id].proxies[name] = {
    character: {
      prefix: `${name}:`,
      msgCount: 0,
      nick: name,
      isNarrator: false,
    },
    partner: {
      prefix: `${name}!partner:`,
      msgCount: 0,
      nick: `${name}'s ${partner}`,
      isNarrator: false,
    },
  };

  await saveProxies();
}



export async function replyText(
  message: Message,
) {

    return `Replying to: ${message.author.username} | ${message.url}
> ${message.content.slice(0, Math.min(message.content.length, 200))}`

  await saveProxies();
}
