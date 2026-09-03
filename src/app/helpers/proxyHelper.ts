
import fs from "fs/promises";
import path from "path";
import { Client, ColorResolvable, EmbedBuilder, parseWebhookURL, Webhook, WebhookClient } from "discord.js";

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
    narrator: ProxyData,
    proxies: Record<string, Proxies>,
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

export async function proxyCheck(client: Client, id: string, channel: string, content: string) {
    await loadProxies();
    if (!proxyDex[id]) {
        return;
    }
    const proxy = isProxy(id, content);
    if (proxy === null) {
        console.log("No proxy detected!")
        return;
    } else  {
                console.log("Proxy detected!")

        if (proxy[0] != "Narrator"){
            //character helper
            //proxy[0]
        }

        sendWebhook(client, proxy[1], content.replace(proxy[1].prefix, ""), channel);
        proxy[1].msgCount++;
        await saveProxies();
    }
}

export function isProxy(id: string, content: string): [string, ProxyData] | null {
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

export async function sendWebhook(client: Client, data: ProxyData, content: string, channel: string) {
    const webhookClient = new WebhookClient({ id: `1544773325082071121`, token: `poL2gSg_1xRxCNBigZYMAlFqp4m9s_ItUNWllYB6ij7w2xj5AWI7OQ0X7L_PY23N0BW4` });
    if (!webhookClient) {
        return;
    }

    await webhookClient.edit({ channel: channel });

    if (data.isNarrator) {
        const embed = new EmbedBuilder().setDescription(content)
        if (data.embedColor)
            embed.setColor(data.embedColor)

        webhookClient.send({
            username: data?.nick,
            avatarURL: data?.pfp_link,
            embeds: [embed]
        })
    } else {
        webhookClient.send({
            content: content,
            username: data?.nick,
            avatarURL: data?.pfp_link,
            embeds: []
        })
    }
}

export async function addCharacter(id: string, username: string, name: string, partner: string) {
    await loadProxies();
    if (!proxyDex[id]) {
        proxyDex[id] = {
            narrator: {
                prefix: "narr:",
                msgCount: 0,
                nick: `${username}'s narrator`,
                isNarrator: true
            },
            proxies: {}
        }
    }
    proxyDex[id].proxies[name] = {
        character: {
            prefix: `${name}:`,
            msgCount: 0,
            nick: name,
            isNarrator: false
        }, partner: {
            prefix: `${name}!partner:`,
            msgCount: 0,
            nick: `${name}'s ${partner}`,
            isNarrator: false
        }
    }

    await saveProxies();
}