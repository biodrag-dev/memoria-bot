import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EmbedBuilder } from "discord.js";

import * as pokehelper from "./pokeHelper";

interface Partner {
  shiny: boolean;
  species: string;
  specialMoves: Record<string, unknown>;
}

interface Character {
  name: string;
  house: string;
  badges: string[];
  registeredOn: Date;
  destination: string;
  partner: Partner;
}

interface UserData {
  characters: Record<string, Character>;
}

type CharacterDex = Record<string, UserData>;
type EvoDex = Record<string, string>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
const jsonsPath = path.resolve(__dirname, "../../../jsons");

let charaDex: CharacterDex | null = null;
let evoDex: EvoDex | null = null;

async function loadUsers() {
  if (!charaDex) {
    const data = await fs.readFile(`${jsonsPath}/users.json`, "utf8");

    charaDex = JSON.parse(data) as CharacterDex;
  }
}

async function loadEvos() {
  if (!evoDex) {
    const data = await fs.readFile(`${jsonsPath}/evoDestinations.json`, "utf8");

    evoDex = JSON.parse(data) as EvoDex;
  }
}

async function saveUsers() {
  await fs.writeFile(
    `${jsonsPath}/users.json`,
    JSON.stringify(charaDex, null, 2),
    "utf8",
  );
}

async function saveEvos() {
  await fs.writeFile(
    `${jsonsPath}/evoDestinations.json`,
    JSON.stringify(evoDex, null, 2),
    "utf8",
  );
}

export async function getCharactersObj(id: string): Promise<Character[]> {
  await loadUsers();

  const characters: Character[] = [];

  if (!charaDex?.[id]) {
    return characters;
  }

  for (const character of Object.values(charaDex[id].characters)) {
    characters.push(character);
  }

  return characters;
}

export async function getCharacterNames(id: string): Promise<string[]> {
  await loadUsers();

  const names: string[] = [];

  if (!charaDex?.[id]) {
    return names;
  }

  for (const character of Object.values(charaDex[id].characters)) {
    names.push(character.name);
  }

  return names;
}

export async function registerCharacter(
  user: string,
  name: string,
  house: string,
  destination: string,
  shiny: boolean,
): Promise<EmbedBuilder> {
  await loadUsers();
  await loadEvos();

  const destinationName =
    destination.charAt(0).toUpperCase() + destination.slice(1).toLowerCase();

  if (!charaDex![user]) {
    charaDex![user] = {
      characters: {},
    };
  }

  if (pokehelper.isLegendOrMyth(destination) == true) {
    return new EmbedBuilder()
      .setDescription(
        `Pokemon Species ${destinationName} is legendary or mythical!`,
      )
      .setColor("Red");
  }

  if (!evoDex[destination.toLowerCase()]) {
    return new EmbedBuilder()
      .setDescription(
        `Pokemon Species ${destinationName} has already been claimed!`,
      )
      .setColor("Red");
  }

  const pokemon = await pokehelper.findPokemon(destination);

  if (!pokemon) {
    return new EmbedBuilder()
      .setDescription(`Pokemon Species ${destinationName} could not be found!`)
      .setColor("Red");
  }

  const basemon = await pokehelper.findBaseMon(pokemon);

  const character: Character = {
    name,
    house,
    badges: [],
    registeredOn: new Date(),

    destination: destination.toLowerCase(),

    partner: {
      shiny,
      species: basemon.name,
      specialMoves: {},
    },
  };

  evoDex![destination.toLowerCase()] = user;

  charaDex![user].characters[name] = character;

  await saveUsers();
  await saveEvos();

  return new EmbedBuilder()
    .setDescription(`${name} was registered successfully!`)
    .setColor("Green");
}

export async function deleteCharacter(
  id: string,
  name: string,
): Promise<EmbedBuilder> {
  await loadUsers();
  await loadEvos();

  const user = charaDex?.[id];

  const character = user?.characters[name];

  if (!character) {
    return new EmbedBuilder()
      .setDescription(`User or Character ${name} could not be found!`)
      .setColor("Red");
  }

  const evoDestination = character.destination;

  delete evoDex![evoDestination];

  delete user.characters[name];

  await saveEvos();
  await saveUsers();

  const displayDestination =
    evoDestination.charAt(0).toUpperCase() +
    evoDestination.slice(1).toLowerCase();

  return new EmbedBuilder()
    .setDescription(
      `Character ${name} was deleted along with destination ${displayDestination}!`,
    )
    .setColor("Green");
}

export async function deleteAll(id: string): Promise<EmbedBuilder> {
  await loadUsers();
  await loadEvos();

  if (!charaDex?.[id]) {
    return new EmbedBuilder()
      .setDescription("User could not be found!")
      .setColor("Red");
  }

  for (const character of Object.values(charaDex[id].characters)) {
    delete evoDex![character.destination];
  }

  delete charaDex[id];

  await saveUsers();
  await saveEvos();

  return new EmbedBuilder()
    .setDescription("All characters were deleted!")
    .setColor("Green");
}

export async function editCharacter(
  id: string,
  name: string,
): Promise<string[]> {
  await loadUsers();

  if (!charaDex?.[id]) {
    return [];
  }

  return Object.values(charaDex[id].characters).map(
    (character) => character.name,
  );
}
