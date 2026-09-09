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
}

interface category {
  name: string,
  description: string
}

interface catalogue {
  currentCatCount: number,
  currentItemCount: number,
  categories: Record<number, category> // category id
  items: Record<number, Record<number, item>> // category, then item id
}

const catalogue: catalogue = loadItems();

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

function getCategories() {
  return Object.entries(catalogue.categories).map(([key, value]) => ({
    value: `${key}`,
    name: value.name,
  }))
}

function createCategory(name: string) {

}

function deleteCategory(id: number) { }

function editCategory(id: number, name: string | undefined, desc: string | undefined) {

}

function getItem(id: number) {

}


function createItem(
  category: string,
  name: string,
  description: string,
  emoji: string,
) { }


function getCharacterInventoryItems(id: string, character: string, category: number) {
  const users = characterHelper.getUsers();
  const person = users[id]?.characters[character];

  if (!person) {
    return;
  }

  const items = [];
  for (const item of person?.inventory) {
    items.push({
      value: item.id,
      name: `catalogue.categories[item.category]?.name`
    })
  }

  const embed = new EmbedBuilder();
  embed.setTitle(categoryInfo?.name ?? "How did you get this category?")
}

function getQuantityOfItem(inventory: characterHelper.inventoryItem[]){

}


function getInventoryPage(id: string, character: string, category: number) {
  const users = characterHelper.getUsers();
  const person = users[id]?.characters[character];

  if (!person) {
    return;
  }
  const categoryInfo = catalogue.categories[category];

  for (const item of person?.inventory) {

  }

  const embed = new EmbedBuilder();
  embed.setTitle(categoryInfo?.name ?? "How did you get this category?")

}
