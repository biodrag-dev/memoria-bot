import type {
    ChatInputCommand,
    CommandData,
    CommandMetadata,
} from "commandkit";

import {
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    InteractionContextType,
} from "discord.js";

import * as characterHelper from "../helpers/characterHelper";
import * as inventoryHelper from "../helpers/extraHelpers/inventoryHelper";

import { EmbedBuilder } from "discord.js";

export const metadata: CommandMetadata = {
    guilds: [`${process.env.GUILD_ID}`],

};

export const command: CommandData = {
    name: "admin-inventory",
    description: "Admin only commands!",
    default_member_permissions: "0",
    dm_permission: false,

    contexts: [InteractionContextType.Guild],
    options: [
        {
            name: "create",
            description: "create",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "item",
                    description: "view balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "name",
                            description: "name of the item",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "description",
                            description: "Character name",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "usable",
                            description: "is it usable?",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                        {
                            name: "price",
                            description: "does it have a price? (0 if not)",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        },
                        {
                            name: "key",
                            description: "Is it a key item? (Can only have one)",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                        {
                            name: "emoji",
                            description: "emoji?",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                    ]
                },
                {
                    name: "category",
                    description: "add balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "name",
                            description: "Category Name",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "description",
                            description: "Category",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "display",
                            description: "Is this category displayed?",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                    ]
                },
            ],
        },

        {
            name: "edit",
            description: "edit",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "item",
                    description: "view balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "name",
                            description: "name of the item",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "description",
                            description: "Character name",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "usable",
                            description: "is it usable?",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                        {
                            name: "price",
                            description: "does it have a price? (0 if not)",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        },
                        {
                            name: "key",
                            description: "Is it a key item? (Can only have one)",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                        {
                            name: "emoji",
                            description: "emoji?",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                    ]
                },
                {
                    name: "category",
                    description: "add balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "name",
                            description: "Category Name",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "description",
                            description: "Category",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "display",
                            description: "Is this category displayed?",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                    ]
                },
            ],
        },

        {
            name: "delete",
            description: "create",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "item",
                    description: "view balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "item",
                            description: "Character owner",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ]
                },
                {
                    name: "category",
                    description: "add balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "category",
                            description: "Character owner",
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                            required: true,
                        },
                    ]
                },
            ],
        },
        {
            name: "item",
            description: "change the amount of something",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "set",
                    description: "view balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "roleplayer",
                            description: "Character owner",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "character",
                            description: "Character name",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            autocomplete: true,
                        },
                    ]
                },
                {
                    name: "give",
                    description: "add balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "roleplayer",
                            description: "Character owner",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "character",
                            description: "Character name",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            autocomplete: true,
                        },
                        {
                            name: "amount",
                            description: "How much are you changing the value by?",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        },
                    ]
                },
            ],
        },
    ],
};

export const autocomplete = async (ctx: any) => {
    const interaction = ctx.interaction;

    const focused = interaction.options.getFocused(true);
    const sub = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group == "qotd" && sub == "remove") {
        return await interaction.respond(qotdHelper.getIndexToRemove());
    }

    if (sub == "toggle-badge") {
        const characterId = interaction.options.getString("character", false);

        if (focused.name === "badge") {
            if (!characterId) {
                return await interaction.respond([]);
            } else {
                const badges = await characterHelper.getPossibleBadges(
                    interaction.user.id,
                    characterId,
                );
                return await interaction.respond(badges);
            }
        }
    }
    if (group == "delete" && sub == "reserve") {
        return await interaction.respond(
            await submitHelper.getAllReserves(interaction.client),
        );
    }

    const user = interaction.options._hoistedOptions[0].value;

    if (!user) {
        return interaction.respond([]);
    }

    const names = await characterHelper.getCharacterNames(user);

    const filtered = names
        .filter((name: string) =>
            name.toLowerCase().startsWith(focused.value.toLowerCase()),
        )
        .slice(0, 25);

    await interaction.respond(
        filtered.map((name: string) => ({
            name,
            value: name,
        })),
    );
};

export const chatInput: ChatInputCommand = async (ctx) => {
    const interaction = ctx.interaction;

    if (!interaction.inGuild()) {
        return interaction.reply({
            content: "This command can only be used in a server.",
            ephemeral: true,
        });
    }

    const group = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand();

    if (group == "qotd") {
        if (sub == "queue") {
            return interaction.reply({ embeds: [qotdHelper.getQueue()] });
        } else if (sub == "remove") {
            qotdHelper.removeIndex(Number.parseInt(interaction.options.getString("index", true)));
            return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription("QOTD removed successfully!")] });
        } else if (sub == "force") {
            qotdHelper.sendQuestion(interaction.client);
            return interaction.reply({ embeds: [new EmbedBuilder().setColor("Green").setDescription("QOTD forced!")] });
        }
        return;
    }
};
