import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    InteractionContextType,
} from "discord.js";

import type { CommandData, ChatInputCommand, CommandMetadata } from "commandkit";
import * as characterHelper from "../helpers/characterHelper";

export const metadata: CommandMetadata = {
    guilds: [`${process.env.GUILD_ID}`],
};

export const command: CommandData = {
    name: "birthday",
    description: "send a msg",
    contexts: [InteractionContextType.Guild],
    options: [
        {
            name: "personal",
            description: "set your own bithday!",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: "set",
                description: "set your own bithday!",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "month",
                        description: "your birthday month!",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [{ value: `0`, name: `January` }, { value: `1`, name: `February` }, { value: `2`, name: `March` }, { value: `3`, name: `April` }, { value: `4`, name: `May` }, { value: `5`, name: `June` }, { value: `6`, name: `July` }, { value: `7`, name: `August` }, { value: `8`, name: `September` }, { value: `9`, name: `October` }, { value: `10`, name: `November` }, { value: `11`, name: `December` }]
                    },
                    {
                        name: "date",
                        description: "the day of the month!",
                        type: ApplicationCommandOptionType.Number,
                        required: true,
                    },
                ],
            },]
        },
        {
            name: "character",
            description: "set your oc's bithday!",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: "set",
                description: "set your own bithday!",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "month",
                        description: "your birthday month!",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [{ value: `0`, name: `January` }, { value: `1`, name: `February` }, { value: `2`, name: `March` }, { value: `3`, name: `April` }, { value: `4`, name: `May` }, { value: `5`, name: `June` }, { value: `6`, name: `July` }, { value: `7`, name: `August` }, { value: `8`, name: `September` }, { value: `9`, name: `October` }, { value: `10`, name: `November` }, { value: `11`, name: `December` }]
                    },
                    {
                        name: "date",
                        description: "the day of the month!",
                        type: ApplicationCommandOptionType.Number,
                        required: true,
                    },
                ],
            },]
        },
    ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
    const interaction = ctx.interaction;
    const month = interaction.options.getString("month", true);
    const date = interaction.options.getNumber("date", true);

    const group = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand(true);

    if (group === "personal") {
        if (sub === "set") {
            const embed = await characterHelper.setBday(interaction.user.id, Number(month), date);
            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    }
}