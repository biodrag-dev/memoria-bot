import fs from "fs";
import path from "path";

const jsonsPath = path.resolve(__dirname, "../../../jsons");
import * as characterHelper from "../characterHelper";
import { EmbedBuilder } from "discord.js";

interface item {
  name: string;
  description: string;
  usable: boolean;
  price: number;
  emoji?: string;
}

interface category {
  name: string;
  description: string;
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
};
const lostItem: item = {
  name: `Lost Item`,
  description: `This item has been lost to time.`,
  usable: false,
  price: 0,
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

export function getCategories() {
  return Object.entries(catalogue.categories).map(([key, value]) => ({
    value: `${key}`,
    name: value.name,
  }));
}

export function createCategory(name: string, description: string) {
  catalogue.categories[catalogue.currentCatCount] = {
    name,
    description,
  };
  catalogue.items[catalogue.currentCatCount] = {};

  catalogue.currentCatCount++;
  saveItems();
}

export function deleteCategory(id: number) {
  delete catalogue.categories[id];
  delete catalogue.items[id];
  saveItems();
}

export function editCategory(
  id: number,
  name: string | undefined,
  desc: string | undefined,
) {
  if (!catalogue.categories[catalogue.currentCatCount]) {
    return;
  }
  if (name) {
    catalogue.categories[catalogue.currentCatCount]!.name = name;
  }
  if (desc) {
    catalogue.categories[catalogue.currentCatCount]!.description = desc;
  }
  saveItems();
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
  }
  characterHelper.saveUsersExternal(users);
}

export function setItemInInventory(
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
    if (amount <= 0) {
      person.inventory.splice(itemIndex, 1);
    } else {
      person.inventory[itemIndex]!.quantity = amount;
    }
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
  };

  catalogue.currentItemCount++;
  saveItems();
}

export function getCharacterInventoryItems(
  id: string,
  character: string,
  category: number,
) {
  const users = characterHelper.getUsers();
  const person = users[id]?.characters[character];

  if (!person) {
    return;
  }

  const items = person.inventory.filter((item) => item.category == category);
  var string = ``;
  const categoryInfo = catalogue.items[category];
  for (const item of items) {
    const itemInfo: item = categoryInfo
      ? (categoryInfo[item.id] ?? lostItem)
      : lostItem;
    string += `${itemInfo.emoji ? `${itemInfo.emoji} ` : ``}**${itemInfo.name} // x ${item.quantity}**`;
    string += `> ${itemInfo.description}\n`;
  }
  const cat = catalogue.categories[category];
  const embed = new EmbedBuilder();
  embed.setTitle(cat?.name ?? "How did you get this category?");
  embed.setDescription(`-# ${cat?.description ?? "No description listed for category."}
${string == `` ? `Nothing to see here!` : string}`);
  return embed;
}

export function getInventoryPage(category: number) {
  var string = ``;
  for (const item of Object.values(category)) {
    const itemInfo: item = item;
    string += `${itemInfo.emoji ? `${itemInfo.emoji} ` : ``}**${itemInfo.name}${itemInfo.price != 0 ? ` // ₽${itemInfo.price}` : ``}**`;
    string += `> -# usable | ${itemInfo.usable}`;
    string += `> ${itemInfo.description}\n`;
  }
  const cat = catalogue.categories[category];
  const embed = new EmbedBuilder();
  embed.setTitle(cat?.name ?? "How did you get this category?");
  embed.setDescription(`-# ${cat?.description ?? "No description listed for category."}
${string == `` ? `Nothing to see here!` : string}`);
  return embed;
}
