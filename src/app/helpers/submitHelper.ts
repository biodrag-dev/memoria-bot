import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EmbedBuilder } from "discord.js";

import * as pokehelper from "./pokeHelper";

interface Character {
  name: string;
  house: string;
  docLink: string;
  partner: string;
}

interface EvoData {
  user: string;
  status: string;
  dateMade: Date;
}

type SubmitDex = Record<string, Character>;
type EvoDex = Record<string, EvoData>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonsPath = path.resolve(__dirname, "../../../jsons");

let submitDex: SubmitDex | null = null;
let evoDex: EvoDex | null = null;

async function toProperCase(name: string){
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function loadSubmissions() {
  if (!submitDex) {
    const data = await fs.readFile(`${jsonsPath}/submissions.json`, "utf8");
    submitDex = JSON.parse(data) as SubmitDex;
  }
}

async function saveSubmissions() {
  await fs.writeFile(
    `${jsonsPath}/submissions.json`,
    JSON.stringify(evoDex, null, 2),
    "utf8",
  );
}

async function loadEvos() {
  if (!evoDex) {
    const data = await fs.readFile(`${jsonsPath}/evoDestinations.json`, "utf8");
    evoDex = JSON.parse(data) as EvoDex;
  }
}

async function saveEvos() {
  await fs.writeFile(
    `${jsonsPath}/evoDestinations.json`,
    JSON.stringify(evoDex, null, 2),
    "utf8",
  );
}

//checks if the destination is valid, ie. the evo isn't taken, or they've already reserved it
export async function checkDestination(id: string, name: string) {
  await loadEvos();
  if (!evoDex[`${name}`] || (evoDex[`${name}`].user == id && evoDex[`${name}`].status != "Approved")) return true;
  return false;
}

export async function getDestination(name: string): Promise<EvoData> {
  await loadEvos();
  return evoDex[`${name}`];
}

//approves a reservation
async function approveDestination(name: string) {
  await loadEvos();
  evoDex[`${name}`].status = "Approved";
  evoDex[`${name}`].dateMade = new Date();
  await saveEvos();
}

//deletes a destination
export async function deleteDestination(name: string) {
  await loadEvos();
  delete evoDex[`${name}`];
  await saveEvos();
}

export async function getReserve(id: string) {
  await loadEvos();
  return Object.entries(evoDex)
    .filter(([_, data]) => data.user === id && data.status === "Reserved")
    .map(([name]) => name);
}

//creates a destination entry with reserved status. will override existing ones
async function createDestination(id: string, name: string) {
  await loadEvos();
  const evoData: EvoData = {
    user: id,
    status: "Reserved",
    dateMade: new Date(),
  };
  evoDex[`${name}`] = evoData;
  await saveEvos();
}

export async function hasSubmit(id: string) {
  await loadSubmissions();
  if (submitDex[`${id}`]) return true;
  return false;
}
export async function denySubmit(id: string) {
  await loadEvos();
  await loadSubmissions();
}

export async function approveSubmit() {
  await loadEvos();
  await loadSubmissions();
}

export async function createSubmit(
  id: string,
  name: string,
  house: string,
  docLink: string,
  partner: string,
) {
  await loadSubmissions();

  const submitData: Character = {
    name,
    house,
    docLink,
    partner,
  };
  submitDex[`${id}`] = submitData;
  createDestination(id, partner);

  await saveSubmissions();
}

export async function editCharacter(
  id: string,
  name: string,
): Promise<string[]> {
  await loadEvos();
  await loadSubmissions();

  if (!charaDex?.[id]) {
    return [];
  }

  return Object.values(charaDex[id].characters).map(
    (character) => character.name,
  );
}
