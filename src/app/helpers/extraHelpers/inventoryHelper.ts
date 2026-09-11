import fs from "fs";
import path from "path";

const jsonsPath = path.resolve(__dirname, "../../../jsons");
import * as characterHelper from "../characterHelper";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Interaction,
  InteractionReplyOptions,
  MessageEditOptions,
  MessageReplyOptions,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

interface item {
  name: string;
  description: string;
  usable: boolean;
  price: number;
  emoji?: string;
  key: boolean;
}

interface category {
  name: string;
  description: string;
  display: boolean;
}

interface catalogue {
  currentCatCount: number;
  currentItemCount: number;
  categories: Record<number, category>; // category id
  items: Record<number, Record<number, item>>; // category, then item id
}

const catalogue: catalogue = loadItems();

const lostCategory: category = {
  name: `Lost Category`,
  description: `This category has been lost to time.`,
  display: false,
};
const lostItem: item = {
  name: `Lost Item`,
  description: `This item has been lost to time.`,
  usable: false,
  price: 0,
  key: false,
};

function loadItems() {
  const data = fs.readFileSync(`${jsonsPath}/items.json`, "utf8");
  return JSON.parse(data) as catalogue;
}

function saveItems() {
  fs.writeFileSync(
    `${jsonsPath}/items.json`,
    JSON.stringify(catalogue, null, 2),
    "utf8",
  );
}

export async function itemInventoryGiftNotification(
  client: Client,
  id: string,
  character: string,
  amount: number,
  category: number,
  itemid: number,
) {
  const channel = (await client.channels.fetch(
    `${process.env.IRP_NOTIFICATIONS}`,
  )) as TextChannel;
  const item = (catalogue.items[category]![itemid] ?? lostItem);
  const embed = new EmbedBuilder();
  embed
    .setDescription(
      `**${character}** recieved ${item.emoji ?? ``} **${item.name}** x**${amount}**!`,
    )
    .setColor("Greyple");
  channel.send({ content: `<@${id}>`, embeds: [embed] });
}

export function getCategories() {
  return Object.entries(catalogue.categories).map(([key, value]) => ({
    value: `${key}`,
    name: value.name,
  }));
}

export function createCategory(
  name: string,
  description: string,
  display: boolean,
) {
  catalogue.categories[catalogue.currentCatCount] = {
    name,
    description,
    display,
  };
  catalogue.items[catalogue.currentCatCount] = {};

  catalogue.currentCatCount++;
  saveItems();
}

export function deleteItem(category: number, id: number) {
  delete catalogue.items[category]![id];
  saveItems();
}
export function deleteCategory(id: number) {
  delete catalogue.categories[id];
  delete catalogue.items[id];
  saveItems();
}

export function editCategory(
  id: number,
  name: string | null,
  desc: string | null,
  display: boolean | null,
) {
  if (!catalogue.categories[id]) {
    return;
  }
  if (name) {
    catalogue.categories[id]!.name = name;
  }
  if (desc) {
    catalogue.categories[id]!.description = desc;
  }
  if (display != undefined) {
    catalogue.categories[id]!.display = display;
  }
  saveItems();
}

export function editItem(
  category: number,
  itemId: number,
  name: string | null,
  description: string | null,
  emoji: string | null,
  usable: boolean | null,
  price: number | null,
  key: boolean | null,
) {
  const item = catalogue.items[category]![itemId]!;
  if (name) {
    item.name = name;
  }
  if (description) {
    item.description = description;
  }
  if (emoji) {
    item.name = emoji;
  }
  if (usable == true) {
    item.usable = true;
  } else if (usable == false) {
    item.usable = false;
  }
  if (price) {
    item.price = price;
  }
  if (key == true) {
    item.key = true;
  } else if (key == false) {
    item.key = false;
  }
  saveItems();
}

export function getAllItemIds() {
  const items = [];

  for (const [categoryId, catalogueItems] of Object.entries(catalogue.items)) {
    for (const [itemId, item] of Object.entries(catalogueItems)) {
      items.push({
        value: `${categoryId}:${itemId}`,
        name: `${catalogue.categories[Number(categoryId)]?.name ?? lostCategory.name} | ${item.name}`,
      });
    }
  }
  return items;
}

export function addItemToInventory(
  id: string,
  character: string,
  category: number,
  itemId: number,
  amount: number,
) {
  const users = characterHelper.getUsers();
  const person = users[id]?.characters[character];

  if (!person) {
    return;
  }

  const itemIndex = person.inventory.findIndex(
    (item) => item.category == category && item.id == itemId,
  );
  if (itemIndex != -1) {
    person.inventory[itemIndex]!.quantity += amount;
    if (person.inventory[itemIndex]!.quantity <= 0) {
      person.inventory.splice(itemIndex, 1);
    }
  } else {
    person.inventory.push({
      quantity: amount,
      id: itemId,
      category: category,
    });
  }
  characterHelper.saveUsersExternal(users);
}

export function setItemInInventory(
  id: string,
  character: string,
  category: number,
  itemId: number,
  amount: number,
  isSetting: boolean,
) {
  const users = characterHelper.getUsers();
  const person = users[id]?.characters[character];

  if (!person) {
    return;
  }

  const itemIndex = person.inventory.findIndex(
    (item) => item.category == category && item.id == itemId,
  );
  if (itemIndex != -1) {
    if (amount <= 0) {
      person.inventory.splice(itemIndex, 1);
    } else {
      person.inventory[itemIndex]!.quantity =
        amount + (isSetting ? 0 : person.inventory[itemIndex]!.quantity);
    }
  } else {
    person.inventory.push({
      quantity: amount,
      id: itemId,
      category: category,
    });
  }
  characterHelper.saveUsersExternal(users);
}

export function createItem(
  category: number,
  name: string,
  description: string,
  emoji: string | undefined,
  usable: boolean,
  price: number,
  key: boolean,
) {
  if (!catalogue.items[category]) {
    return;
  }
  catalogue.items[category][catalogue.currentItemCount] = {
    name,
    description,
    emoji,
    usable,
    price,
    key,
  };

  catalogue.currentItemCount++;
  saveItems();
}

export function getCharacterInventoryItems(
  id: string,
  character: string,
  category: number,
): InteractionReplyOptions | MessageEditOptions {
  const users = characterHelper.getUsers();
  const person = users[id]?.characters[character];

  if (!person) {
    return {
      embeds: [
        new EmbedBuilder().setDescription("Character could not be found!"),
      ],
    };
  }

  const items = person.inventory.filter((item) => item.category == category);
  var string = ``;
  const categoryInfo = catalogue.items[category];
  for (const item of items) {
    const itemInfo: item = categoryInfo
      ? (categoryInfo[item.id] ?? lostItem)
      : lostItem;
    string += `${itemInfo.emoji ? `${itemInfo.emoji} ` : ``}**${itemInfo.name}${itemInfo.key == true ? `` : ` // x${item.quantity}`}**`;
    string += `\n> ${itemInfo.description}\n`;
  }
  const cat = catalogue.categories[category];
  const embed = new EmbedBuilder();
  embed.setColor(characterHelper.houseData[person.house]!.hexcode);
  embed.setTitle(
    `${person.name}'s Inventory | ${cat?.name ?? lostCategory.name}`,
  );
  embed.setDescription(`-# ${cat?.description ?? lostCategory.description}
${string == `` ? `Nothing to see here!` : string}`);

  const row = new ActionRowBuilder<ButtonBuilder>();
  for (const [key, value] of Object.entries(catalogue.categories)) {
    if (value.display === true) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`inventory:${id}:${character}:${key}`)
          .setLabel(`${value.name}`)
          .setStyle(
            Number(key) == category
              ? ButtonStyle.Primary
              : ButtonStyle.Secondary,
          ),
      );
    }
  }
  return {
    embeds: [embed],
    components: [row],
  };
}

export function getInventoryPage(
  category: number,
): InteractionReplyOptions | MessageEditOptions {
  var string = ``;
  for (const item of Object.values(catalogue.items[category] ?? lostCategory)) {
    const itemInfo: item = item;
    string += `${itemInfo.emoji ? `${itemInfo.emoji} ` : ``}**${itemInfo.name}${itemInfo.price != 0 ? ` // ₽${itemInfo.price}` : ``}**`;
    string += `\n> -# **usable?** | ${itemInfo.usable}`;
    string += `\n> ${itemInfo.description}\n`;
  }
  const cat = catalogue.categories[category];
  const embed = new EmbedBuilder();
  embed.setTitle(cat?.name ?? "How did you get this category?");
  embed.setDescription(`-# ${cat?.description ?? "No description listed for category."}\n
${string == `` ? `Nothing to see here!` : string}`);
  const row = new ActionRowBuilder<ButtonBuilder>();
  for (const [key, value] of Object.entries(catalogue.categories)) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`adminInventory:${key}`)
        .setLabel(`${value.name}`)
        .setStyle(
          Number(key) == category ? ButtonStyle.Primary : ButtonStyle.Secondary,
        ),
    );
  }
  return {
    embeds: [embed],
    components: [row],
  };
}

export async function handleAdminInventoryPage(interaction: Interaction) {
  if (!interaction.isButton()) return;

  const [key, page] = interaction.customId.split(":");

  if (key != "adminInventory") {
    return;
  } else if (
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
  ) {
    return interaction.reply({
      content: `Spoilers~ You're not supposed to be looking at that!`,
      ephemeral: true,
    });
  }
  await interaction.deferUpdate();
  interaction.message.edit(
    getInventoryPage(Number(page)) as MessageEditOptions,
  );
}

export async function handleCharacterInventoryPage(interaction: Interaction) {
  if (!interaction.isButton()) return;

  const [key, id, character, page] = interaction.customId.split(":");

  if (key != "inventory") {
    return;
  } else if (
    id != interaction.user.id &&
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
  ) {
    return interaction.reply({
      content: `It's rude to rifle through other people's things, you know?`,
      ephemeral: true,
    });
  }
  await interaction.deferUpdate();
  interaction.message.edit(
    getCharacterInventoryItems(
      id!,
      character!,
      Number(page),
    ) as MessageEditOptions,
  );
}
