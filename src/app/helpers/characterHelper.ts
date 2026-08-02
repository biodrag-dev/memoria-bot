import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EmbedBuilder } from "discord.js";

import * as pokehelper from "./pokeHelper";
import * as submitHelper from "./submitHelper";

interface Partner {
  shiny: boolean;
  species: string;
  specialMoves: Record<string, unknown>;
  sizeMult: number;
}
interface CharacterData{
  message_id: number | null;
  age: number | null;
  gender: string | null;
  bio: string | null;
  pronouns: string | null;
  img_link: string | null;
  artist_credits: string | null;
}

interface Character {
  name: string;
  house: string;
  badges: string[];
  registeredOn: Date;
  destination: string;
  partner: Partner;
  optional: CharacterData;
}

interface UserData {
  characters: Record<string, Character>;
}

type CharacterDex = Record<string, UserData>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonsPath = path.resolve(__dirname, "../../../jsons");

let charaDex: CharacterDex | null = null;

async function loadUsers() {
  if (!charaDex) {
    const data = await fs.readFile(`${jsonsPath}/users.json`, "utf8");

    charaDex = JSON.parse(data) as CharacterDex;
  }
}

async function saveUsers() {
  await fs.writeFile(
    `${jsonsPath}/users.json`,
    JSON.stringify(charaDex, null, 2),
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

export async function registerCharacter(user: string): Promise<EmbedBuilder> {
  await loadUsers();
  const submission = await submitHelper.getSubmit(user);
  const pokemon = await pokehelper.findPokemon(submission.partner);

  const basemon = await pokehelper.findBaseMon(pokemon);

  var sizeMult;
  if (submission.alphaRoll == 20){
    sizeMult = 2
  }else{
    sizeMult = Math.random() / 2 + 0.75;
  }
  const character: Character = {
    name: submission.name,
    house: submission.house,
    badges: [],
    registeredOn: new Date(),
    destination: submission.partner.toLowerCase(),
    partner: {
      shiny: submission.shinyRoll == 20,
      species: basemon.name,
      specialMoves: {},
      sizeMult: sizeMult,
    },
  };
  await submitHelper.approveDestination(submission.partner.toLowerCase());

  if (!charaDex![user]) {
    charaDex[user] = {
      characters: {},
    };
  }
  charaDex![user].characters[submission.name] = character;

  await saveUsers();
}

export async function deleteCharacter(
  id: string,
  name: string,
): Promise<EmbedBuilder> {
  await loadUsers();

  const user = charaDex?.[id];

  const character = user?.characters[name];

  if (!character) {
    return new EmbedBuilder()
      .setDescription(`User or Character ${name} could not be found!`)
      .setColor("Red");
  }

  const evoDestination = character.destination;
  await submitHelper.deleteDestination(evoDestination);

  delete user.characters[name];

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

  if (!charaDex?.[id]) {
    return new EmbedBuilder()
      .setDescription("User could not be found!")
      .setColor("Red");
  }

  for (const character of Object.values(charaDex[id].characters)) {
    await submitHelper.deleteDestination(evoDestination);
  }

  delete charaDex[id];

  await saveUsers();

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
