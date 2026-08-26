import { EmbedBuilder } from "discord.js";



export function embed(name: string) {
    switch (name) {
        case `volcano`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}
        case `test`:
            return {content: ``, embeds: [getEmbed()]}

        default:
            return { content: `No embed linked to codeword!`, ephemeral: true };
    }
}

function getEmbed() {
    const embed = new EmbedBuilder()
        .setTitle(`𝐎𝐍𝐆𝐎𝐈𝐍𝐆 𝐑𝐄𝐒𝐄𝐑𝐕𝐀𝐓𝐈𝐎𝐍𝐒`)
        .setColor("#188eac")
        .setDescription(
            `descHere`,
        )
        .setImage(
            "https://static2.klipy.com/ii/f87f46a2c5aeaeed4c68910815f73eaf/27/de/PSYjpPT7.gif",
        )
        .setFooter({
            text: "banner by @anasabdin on tumblr",
        });

    return embed;
}