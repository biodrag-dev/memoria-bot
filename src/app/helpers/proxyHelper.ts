import fs from "fs/promises";
import path from "path";
import {
    Attachment,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Client,
    ColorResolvable,
    EmbedBuilder,
    Interaction,
    Message,
    TextChannel,
} from "discord.js";

import * as characterHelper from "./characterHelper";
const jsonsPath = path.resolve(__dirname, "../../../jsons");
let proxyDex: Record<string, UserProxies>;

export interface Proxies {
    character: ProxyData;
    partner: ProxyData;
    expDebt: number;
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

const proxyLog = new Set<string>();

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
        return false;
    } else {
        proxyLog.add(message.id);

        if (proxy[0] != "Narrator" && !message.reference) {
            const wordCount: number = message.content
                .replace(proxy[1].prefix, "").trim()
                .split(/\s+/).length;

            const debt: number = proxyDex[id].proxies[proxy[0]]!.expDebt;
            proxyDex[id].proxies[proxy[0]]!.expDebt = Math.max(debt - wordCount, 0);
            await characterHelper.addCurrency(message.client, id, proxy[0], Math.max(wordCount - debt, 0));
        }
        if (message.reference) {
            const original = await message.fetchReference();

            if (original.author.username == proxy[1].nick) {
                if (proxy[0] != "Narrator") {
                    const oldWordCount: number = original.content
                        .trim()
                        .split(/\s+/).length;
                    const newWordCount: number = message.content
                        .replace(proxy[1].prefix, "").trim()
                        .split(/\s+/).length;

                    const debt: number = proxyDex[id].proxies[proxy[0]]!.expDebt;
                    proxyDex[id].proxies[proxy[0]]!.expDebt = Math.max(debt - (newWordCount - oldWordCount), 0);
                    await characterHelper.addCurrency(message.client, id, proxy[0], Math.max((newWordCount - oldWordCount) - debt, 0));
                    await saveProxies();
                }
                proxyEditMsgLog(proxy[1], original, message);
                await editWebhook(
                    message.client,
                    proxy[1],
                    message.content.replace(proxy[1].prefix, ""),
                    message,
                );
                await message.delete();
                return true;
            }
        }
        await sendWebhook(message.client, proxy[1], message, channel);
        proxyLogMsg(proxy[1], message);
        proxy[1].msgCount++;
        await saveProxies();
        await message.delete();
        return true;
    }
}

export async function getAllProxyNames(userID: string) {
    await loadProxies();
    const proxies = []
    if (!proxyDex[userID]) {
        return [];
    }

    proxies.push({
        value: `Narrator:Narrator`,
        name: `Narrator | ${proxyDex[userID].narrator.nick}`
    })
    for (const [character, proxyData] of Object.entries(proxyDex[userID]!.proxies)) {
        proxies.push({
            value: `${character}:character`,
            name: `${character} | ${proxyData.character.nick}`
        });
        proxies.push({
            value: `${character}:partner`,
            name: `${character}'s Partner | ${proxyData.partner.nick}`
        })
    }
    return proxies;
}

export async function editProxyDetails(interaction: ChatInputCommandInteraction, userID: string, name: string, partner: boolean, nick: string | null, pfp: Attachment | null, trigger: string | null, embedColor: ColorResolvable | null) {
    await loadProxies();
    if (!proxyDex[userID]) {
        return new EmbedBuilder();
    }
    var proxy;
    if (name === "Narrator") {
        proxy = proxyDex[userID].narrator;
    } else if (partner == true) {
        proxy = proxyDex[userID].proxies[name]!.partner
    } else {
        proxy = proxyDex[userID].proxies[name]!.character
    }
    const changes = []
    if (nick) {
        changes.push(`**Nickname**
${proxy.nick} -> ${nick}`)
        proxy.nick = nick;
    }
    if (trigger) {
        changes.push(`**Prefix**
${proxy.prefix} -> ${trigger}`)
        proxy.prefix = trigger;
    }
    if (pfp) {
        changes.push(`**Picture**
${proxy.pfp_link ?? "N/A"} -> ${pfp.url}`)
        proxy.pfp_link = pfp.url;
    }
    if (embedColor) {
        changes.push(`**Embed Color**
${proxy.embedColor ?? "N/A"} -> ${embedColor}`)
        proxy.embedColor = embedColor;
    }
    await saveProxies();


    const channel = (await interaction.client.channels.fetch(
        `${process.env.PROXY_LOG}`,
    )) as TextChannel;

    const embed = new EmbedBuilder()
        .setTitle("Proxy Edited")
        .setColor("DarkAqua")
        .setDescription(
            `${changes.join("/n")}`,
        )
        .addFields(
            {
                name: "Author",
                value: `<@${userID}>`,
                inline: true,
            },
        )
        .setTimestamp()
        .setAuthor({
            iconURL: proxy.pfp_link,
            name: proxy.nick,
        });
    channel.send({ embeds: [embed] });
}

export async function getProxyPage(userID: string, name: string, partner: boolean): Promise<EmbedBuilder> {
    await loadProxies();
    if (!proxyDex[userID]) {
        return new EmbedBuilder();
    }
    var proxy;
    if (name === "Narrator") {
        proxy = proxyDex[userID].narrator;
    } else if (partner == true) {
        proxy = proxyDex[userID].proxies[name]!.partner
    } else {
        proxy = proxyDex[userID].proxies[name]!.character
    }

    const embed = new EmbedBuilder()
        .setTitle(proxy.nick)
        .setDescription(`**Roleplayer** | <@${userID}>
**Trigger** | ${proxy.prefix}\`text\`
**Posts** | ${proxy.msgCount}`)
        .setColor(proxy.embedColor ?? null)
        .setThumbnail(proxy.pfp_link ?? null)

    return embed;
}

export function proxyDeleteHelper(
    userID: string,
    message: Message,
): [string, ProxyData] | null {
    if (!proxyDex[userID]) {
        return null;
    }
    if (proxyDex[userID].narrator.nick === message.author.displayName) {
        return ["Narrator", proxyDex[userID].narrator];
    } else {
        for (const [character, proxies] of Object.entries(
            proxyDex[userID]!.proxies,
        )) {
            if (proxies.character.nick === message.author.displayName) {
                return [character, proxies.character];
            } else if (proxies.partner.nick === message.author.displayName) {
                return [character, proxies.partner];
            }
        }
    }
    return null;
}

export async function proxyDelete(userID: string, message: Message) {
    await loadProxies();
    const proxy = await proxyDeleteHelper(userID, message);
    if (proxy) {
        const wordCount: number = message.content
            .trim()
            .split(/\s+/).length;
        proxyDex[userID]!.proxies[proxy[0]]!.expDebt += wordCount;
        await saveProxies();

        proxyDeleteLogMsg(proxy[1], message);
        message.delete();
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
    message: Message,
    channel: string,
) {
    const webhook = await client.fetchWebhook("1544773325082071121");
    if (!webhook) {
        return;
    }

    var reply;
    await webhook.edit({ channel: channel });
    if (message.reference) {
        reply = replyText(await message.fetchReference());
    }
    const content = `${reply ?? ``}${message.content.replace(data.prefix, "")}`;

    const files = [...message.attachments.values()].map((attachment) => ({
        attachment: attachment.url,
        name: attachment.name ?? "image.png",
    }));


    if (data.isNarrator) {
        const embed = new EmbedBuilder().setDescription(content);
        if (data.embedColor) embed.setColor(data.embedColor);
        await webhook.send({
            username: data?.nick,
            avatarURL: data?.pfp_link,
            embeds: [embed],
            files,
        });

    } else {
        await webhook.send({
            content: content,
            username: data?.nick,
            avatarURL: data?.pfp_link,
            embeds: [],
            files
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
        await webhook.editMessage(message.reference?.messageId!, {
            content: content,
            embeds: [],
        });
    }
}

export async function deleteUser(id: string) {
    await loadProxies();
    delete proxyDex[id];
    await saveProxies();
}

export async function deleteCharacter(id: string, name: string) {
    await loadProxies();
    delete proxyDex[id]?.proxies[name];
    await saveProxies();
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
        expDebt: 0,
    };

    await saveProxies();
}

export function replyText(message: Message) {
    return `> \`Replying to:\` [${message.author.username}](${message.url})
> ${message.content.slice(0, 200)}${message.content.length > 200 ? `...` : ``}\n`;
}

export function deleteCheckProxyLog(id: string) {
    if (proxyLog.has(id)) {
        proxyLog.delete(id);
        return true;
    }
    return false;
}

async function proxyLogMsg(proxy: ProxyData, message: Message) {
    const channel = (await message.client.channels.fetch(
        `${process.env.PROXY_LOG}`,
    )) as TextChannel;

    const content = `${message.content.replace(proxy.prefix, "")}`;

    const attachments = message.attachments.size
        ? [...message.attachments.values()]
            .map((attachment) => attachment.url)
            .join("\n")
        : "*None*";

    const embed = new EmbedBuilder()
        .setTitle("Proxy Message Created")
        .setColor("Blue")
        .setDescription(
            `${content || ""}${message.attachments.size ? `\n-# **Attachments**\n${attachments}` : ``}`,
        )
        .addFields(
            {
                name: "Author",
                value: message.author ? `${message.author}` : "Unknown",
                inline: true,
            },
            {
                name: "Channel",
                value: `${message.channel}`,
                inline: true,
            },
        )
        .setTimestamp()
        .setAuthor({
            iconURL: proxy.pfp_link,
            name: proxy.nick,
        });

    channel.send({ embeds: [embed] });
}

async function proxyEditMsgLog(
    proxy: ProxyData,
    oldMessage: Message,
    newMessage: Message,
) {
    const channel = (await newMessage.client.channels.fetch(
        `${process.env.PROXY_LOG}`,
    )) as TextChannel;

    const oldAttachments = oldMessage.attachments.size
        ? [...oldMessage.attachments.values()]
            .map((attachment) => attachment.url)
            .join("\n")
        : "*None*";

    const newAttachments = newMessage.attachments.size
        ? [...newMessage.attachments.values()]
            .map((attachment) => attachment.url)
            .join("\n")
        : "*None*";

    const oldContent = oldMessage.embeds[0]
        ? oldMessage.embeds[0].description
        : oldMessage.content || "*None*";
    const newContent = newMessage.content.replace(proxy.prefix, "") || "*None*";

    const embed = new EmbedBuilder()
        .setTitle("Proxy Message Edited")
        .setColor("Yellow")
        .setDescription(
            `**Original Message**\n${oldContent}${oldMessage.attachments.size
                ? `\n-# **Attachments**\n${oldAttachments}`
                : ""
            }\n\n**Edited Message**\n${newContent}${newMessage.attachments.size
                ? `\n-# **Attachments**\n${newAttachments}`
                : ""
            }`,
        )
        .addFields(
            {
                name: "Author",
                value: newMessage.author ? `${newMessage.author}` : "Unknown",
                inline: true,
            },
            {
                name: "Channel",
                value: `${newMessage.channel}`,
                inline: true,
            },
        )
        .setTimestamp()
        .setAuthor({
            iconURL: proxy.pfp_link,
            name: proxy.nick,
        });

    channel.send({ embeds: [embed] });
}

async function proxyDeleteLogMsg(proxy: ProxyData, message: Message) {
    const channel = (await message.client.channels.fetch(
        `${process.env.PROXY_LOG}`,
    )) as TextChannel;

    const attachments = message.attachments.size
        ? [...message.attachments.values()]
            .map((attachment) => attachment.url)
            .join("\n")
        : "*None*";

    const content = message.embeds[0]
        ? message.embeds[0].description
        : message.content || "*None*";

    const embed = new EmbedBuilder()
        .setTitle("Proxy Message Deleted")
        .setColor("Red")
        .setDescription(
            `${content || ""}${message.attachments.size ? `\n-# **Attachments**\n${attachments}` : ``
            }`,
        )
        .addFields(
            {
                name: "Author",
                value: message.author ? `${message.author}` : "Unknown",
                inline: true,
            },
            {
                name: "Channel",
                value: `${message.channel}`,
                inline: true,
            },
        )
        .setTimestamp()
        .setAuthor({
            iconURL: proxy.pfp_link,
            name: proxy.nick,
        });

    channel.send({ embeds: [embed] });
}


export async function balanceEmbed(id: string, name: string) {
    await loadProxies();
    const character = await characterHelper.getCharacter(id, name);
    const embed = new EmbedBuilder();
    embed.setAuthor({ name: `${name}'s Bank Account`, iconURL: proxyDex[id]?.proxies[name]?.character.pfp_link })
    embed.setDescription(`**Balance** | ₽${character.balance}`);
    embed.setColor("Green")
    if (character.balance < 1000) {
        embed.setFooter({ text: "brokie lol" })
    }
    return embed;
}