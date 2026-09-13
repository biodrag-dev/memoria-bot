import type {
  ChatInputCommand,
  CommandData,
  CommandMetadata,
} from "commandkit";

import {
  ApplicationCommandOptionType,
  InteractionContextType,
  InteractionReplyOptions,
} from "discord.js";

const DEFAULT_CATEGORY = 0;
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
          description: "Creates an item",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "category",
              description: "Which category?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
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
          ],
        },
        {
          name: "category",
          description: "add balance",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Category Name",
              type: ApplicationCommandOptionType.String,
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
          ],
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
          description: "edits an item",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "item",
              description: "Which item to delete?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "name",
              description: "name of the item",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "description",
              description: "Character name",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "usable",
              description: "is it usable?",
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
            {
              name: "price",
              description: "does it have a price? (0 if not)",
              type: ApplicationCommandOptionType.Integer,
              required: false,
            },
            {
              name: "key",
              description: "Is it a key item? (Can only have one)",
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
            {
              name: "emoji",
              description: "emoji?",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
        {
          name: "category",
          description: "Edits a category",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "category",
              description: "Which category?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "name",
              description: "Category Name",
              type: ApplicationCommandOptionType.User,
              required: false,
            },
            {
              name: "description",
              description: "Category",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "display",
              description: "Is this category displayed in the inventory?",
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
          ],
        },
      ],
    },

    {
      name: "delete",
      description: "Deletes an item or category",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "item",
          description: "Deletes an item",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "item",
              description: "Which item to delete?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: "category",
          description: "Deletes a category",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "category",
              description: "The category to delete",
              type: ApplicationCommandOptionType.String,
              autocomplete: true,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "view",
      description: "change the amount of something",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "inventory",
          description: "Looks into a character's inventory!",
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
          ],
        },
        {
          name: "items",
          description: "views the available items!",
          type: ApplicationCommandOptionType.Subcommand,
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
          description:
            "sets the amount of something in someone's inventory to a set amount",
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
              name: "item",
              description: "Which item to set?",
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
          ],
        },
        {
          name: "give",
          description: "gives a character a certain amount of items",
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
              name: "item",
              description: "Which item?",
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
            {
              name: "notify",
              description: "Will the roleplayer be notified?",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
          ],
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

  if (focused.name == "category") {
    const items = inventoryHelper.getCategories();
    const filtered = items
      .filter((item) =>
        item.name.toLowerCase().startsWith(focused.value.toLowerCase()),
      )
      .slice(0, 25);
    return await interaction.respond(filtered);
  }
  if (focused.name == "item") {
    const items = inventoryHelper.getAllItemIds();
    const filtered = items
      .filter((item) =>
        item.name.toLowerCase().startsWith(focused.value.toLowerCase()),
      )
      .slice(0, 25);
    return await interaction.respond(filtered);
  }
  console.log(focused.name);

  if (focused.name == "character") {
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
    return await interaction.respond(
      filtered.map((name: string) => ({
        name,
        value: name,
      })),
    );
  }

  const user = interaction.options._hoistedOptions[0].value;
  if (!user) {
    return interaction.respond([]);
  }

  const names = characterHelper.getCharacterNames(user);

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

  if (group == "create") {
    if (sub == "item") {
      inventoryHelper.createItem(
        Number(interaction.options.getString("category", true)),
        interaction.options.getString("name", true),
        interaction.options.getString("description", true),
        interaction.options.getString("emoji") ?? undefined,
        interaction.options.getBoolean("usable", true),
        interaction.options.getInteger("price", true),
        interaction.options.getBoolean("key", true),
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Green").setDescription("Item created!"),
        ],
      });
    } else if (sub == "category") {
      inventoryHelper.createCategory(
        interaction.options.getString("name", true),
        interaction.options.getString("description", true),
        interaction.options.getBoolean("display", true),
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription("Category created!"),
        ],
      });
    }
  } else if (group == "edit") {
    if (sub == "item") {
      const [categoryId, itemID] = interaction.options
        .getString("item", true)
        .split(":");

      inventoryHelper.editItem(
        Number(categoryId),
        Number(itemID),
        interaction.options.getString("name"),
        interaction.options.getString("description"),
        interaction.options.getString("emoji"),
        interaction.options.getBoolean("usable"),
        interaction.options.getNumber("price"),
        interaction.options.getBoolean("key"),
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Green").setDescription("Item edited!"),
        ],
      });
    } else if (sub == "category") {
      inventoryHelper.editCategory(
        Number(interaction.options.getString("category", true)),
        interaction.options.getString("name"),
        interaction.options.getString("description"),
        interaction.options.getBoolean("display"),
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription("Category edited!"),
        ],
      });
    }
  } else if (group == "delete") {
    if (sub == "item") {
      const [categoryId, itemID] = interaction.options
        .getString("item", true)
        .split(":");
      inventoryHelper.deleteItem(Number(categoryId), Number(itemID));
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Green").setDescription("Item deleted!"),
        ],
      });
    } else if (sub == "category") {
      inventoryHelper.deleteCategory(
        Number(interaction.options.getString("category", true)),
      );
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription("Category deleted!"),
        ],
      });
    }
  } else if (group == "view") {
    if (sub == "inventory") {
      const message = inventoryHelper.getCharacterInventoryItems(
        interaction.options.getUser("roleplayer", true).id,
        interaction.options.getString("character", true),
        DEFAULT_CATEGORY,
      );
      return interaction.reply(message as InteractionReplyOptions);
    } else if (sub == "items") {
      const message = inventoryHelper.getInventoryPage(DEFAULT_CATEGORY);
      return interaction.reply(message as InteractionReplyOptions);
    }
  } else if (group == "item") {
    if (sub == "set" || sub == "give") {
      const [categoryId, itemID] = interaction.options
        .getString("item", true)
        .split(":");

      inventoryHelper.setItemInInventory(
        interaction.options.getUser("roleplayer", true).id,
        interaction.options.getString("character", true),
        Number(categoryId),
        Number(itemID),
        interaction.options.getInteger("amount", true),
        sub == "set",
      );
      if (sub == "give" && interaction.options.getBoolean("notify") != false) {
        await inventoryHelper.itemInventoryGiftNotification(
          interaction.client,
          interaction.options.getUser("roleplayer", true).id,
          interaction.options.getString("character", true),
          interaction.options.getInteger("amount", true),
          Number(categoryId),
          Number(itemID),
        );
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Item added/set!`),
        ],
      });
    }
  }
};
