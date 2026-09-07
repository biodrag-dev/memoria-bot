import fs from "fs";
import path from "path";
const jsonsPath = path.resolve(__dirname, "../../../jsons");

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Embed, EmbedBuilder, GuildMember, Message, TextChannel, User } from "discord.js";
import { Url } from "url";


export type questionStatus =
    | "Approved"
    | "Denied"
    | "Pending";

interface Question {
    question: string;
    desc?: string;
    image?: string;
    user: string;
}

var questions: Question[] = loadQuestions();

function loadQuestions() {
    const data = fs.readFileSync(`${jsonsPath}/qotds.json`, "utf8");
    return JSON.parse(data) as Question[];
}
function saveQuestions() {
    fs.writeFileSync(
        `${jsonsPath}/qotds.json`,
        JSON.stringify(questions, null, 2),
        "utf8",
    );
}
export async function createSuggestion(client: Client, question: string, desc: string | null, userInfo: string, image: string | undefined) {
    const suggestionEmbed = getSuggestionEmbed("Pending", question, desc, userInfo, image);
    const channel = await client.channels.fetch(`${process.env.QOTD_SUGGESTS}`) as TextChannel;
    channel.send({
        embeds: [suggestionEmbed],
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`QOTDsuggest:${userInfo}:Approved`)
                .setLabel(`Approve`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`QOTDsuggest:${userInfo}:Denied`)
                .setLabel(`Deny`)
                .setStyle(ButtonStyle.Danger)
        )]
    })
}

export async function sendQuestion(client: Client) {
    const question = questions[0]
    if (!question) {
        return false;
    }
    const channel = await client.channels.fetch(`${process.env.QOTD_CHANNEL}`) as TextChannel;
    const msg = await channel.send({
        content: `<@&1534631480373018655>`,
        embeds: [getQuestionEmbed(question)],
    });
    const thread = await msg.startThread({
        name: `QOTD | ${question.question}`,
    });

    questions.splice(0, 1);
    saveQuestions();
    return true;
}

export function updateSuggestionStatus(message: Message, user: string, embed: Embed, status: questionStatus) {
    const updatedEmbed = getSuggestionEmbed(status, embed.title!, embed.description, user, embed.image?.url)
    message.edit({ embeds: [updatedEmbed], components: [] })
}

export function getQueue() {
    const list = questions.map((question, index) => {
        console.log("INDEX:", index); return `${index}. ${question.question} (Submitted by <@${question.user}>)`
    }).join("\n")
    const embed = new EmbedBuilder().setDescription(questions.length == 0 ? `No QOTDs right now!` : list).setTitle("Upcoming QOTDs").setColor("Purple");

    return embed;
}

export function getIndexToRemove() {
    const list = questions.map((question, index) => ({ value: `${index}`, name: `${index + 1}. ${question.question}` }))
    return list;
}

export function removeIndex(index: number) {
    questions.splice(index, 1);
    saveQuestions();
}
function getSuggestionEmbed(status: questionStatus, question: string, desc: string | null, user: string, image: string | undefined) {
    const embed = new EmbedBuilder()
        .setTitle(question)
        .setDescription(desc ?? null)
        .setImage(image ?? null)
        .setAuthor({ name: `QOTD Suggestion ${status}` })
        .addFields({ name: `**Suggester**`, value: `<@${user}>`, inline: true })

    if (status === "Pending") {
        embed.setColor("Yellow");
        embed.setFooter({ text: `${questions.length} question(s) in the queue!` })
    } else if (status === "Approved") {
        embed.setColor("Green");
        embed.setFooter({ text: `${questions.length + 1} question(s) in the queue!` })
        questions.push({ question: question, desc: desc ?? undefined, image: image ?? undefined, user: user })
        saveQuestions();
    } else if (status === "Denied") {
        embed.setColor("Red");
        embed.setFooter({ text: `${questions.length} question(s) in the queue!` })
    }
    embed.addFields({ name: `**Status**`, value: status, inline: true });
    return embed;
}

function getQuestionEmbed(question: Question) {
    const embed = new EmbedBuilder()
        .setTitle(question.question)
        .setDescription(`${question.desc ?? ``}

-# suggested by <@${question.user}>`)
        .setImage(question.image ?? null)
        .setColor("Purple")
        .setFooter({ text: `${questions.length - 1} questions remaining | want to ask your own qotd? do /qotd suggest!` });
    return embed;
}
// /qotd suggest
// /admin qotd force
// /admin qotd view
