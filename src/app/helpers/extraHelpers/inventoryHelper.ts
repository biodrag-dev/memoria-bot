import fs from "fs";
import path from "path";

const jsonsPath = path.resolve(__dirname, "../../../jsons");

interface inventoryItem {
  id: number;
  quantity: number;
}

interface item {
  name: string;
  description: string;
  id: number;
  category: string;
}

const catalogue: Record<string, Record<string, item>> = loadItems();

function loadItems() {
  const data = fs.readFileSync(`${jsonsPath}/items.json`, "utf8");
  return JSON.parse(data) as Record<string, Record<string, item>>;
}

function saveItems() {
  fs.writeFileSync(
    `${jsonsPath}/items.json`,
    JSON.stringify(catalogue, null, 2),
    "utf8",
  );
}

function getCategories() {}

function createCategory() {}

function deleteCategory() {}


function getCategoryItem(
  category: string,
  id: number,
) {}


function createItem(
  category: string,
  name: string,
  description: string,
  emoji: string,
) {}
