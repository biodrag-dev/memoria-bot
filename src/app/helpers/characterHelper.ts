import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  AnyThreadChannel,
  ChannelType,
  Client,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";

import * as pokehelper from "./pokeHelper";
import * as submitHelper from "./submitHelper";

interface Partner {
  nickname?: string;
  shiny: boolean;
  species: string;
  specialMoves: Record<string, unknown>;
  sizeMult: number;
}
interface CharacterData {
  age?: string;
  gender?: string;
  bio?: string;
  pronouns?: string;
  img_link?: string;
  artist_credits?: string;
}

interface Character {
  thread_id?: string;
  name: string;
  house: string;
  badges: string[];
  docLink: string;
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

let charaDex: CharacterDex;

interface houseData {
  hexcode: ColorResolvable;
  iconLink: string;
  thumbnail: string;
}

const houseData: Record<string, houseData> = {
  Victini: {
    hexcode: "#ce1b1b",
    iconLink: "https://play.pokemonshowdown.com/sprites/bwicons/494.png",
    thumbnail:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/494.png",
  },

  Mew: {
    hexcode: "#3473fa",
    iconLink: "https://play.pokemonshowdown.com/sprites/bwicons/151.png",
    thumbnail:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
  },

  Jirachi: {
    hexcode: "#fadb2c",
    iconLink: "https://play.pokemonshowdown.com/sprites/bwicons/385.png",
    thumbnail:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png",
  },
};

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

export async function registerCharacter(user: string, client: Client) {
  await loadUsers();
  const submission = await submitHelper.getSubmit(user);
  const pokemon = await pokehelper.findPokemon(submission.partner);

  const basemon = await pokehelper.findBaseMon(pokemon);

  var sizeMult;
  if (submission.alphaRoll == 20) {
    sizeMult = 2;
  } else {
    sizeMult = Math.random() / 2 + 0.75;
  }

  const charaData: CharacterData = {};
  const character: Character = {
    name: submission.name,
    house: submission.house,
    badges: [],
    registeredOn: new Date(),
    destination: submission.partner.toLowerCase(),
    partner: {
      nickname: undefined,
      shiny: submission.shinyRoll == 20,
      species: basemon.name,
      specialMoves: {},
      sizeMult: sizeMult,
    },
    docLink: submission.docLink,
    optional: charaData,
  };
  await submitHelper.approveDestination(submission.partner.toLowerCase());

  if (!charaDex[user]) {
    charaDex[user] = {
      characters: {},
    };
  }
  charaDex![user].characters[submission.name] = character;

  await saveUsers();
  await createNewForumPost(`${user}`, `${submission.name}`, client);
}

export async function deleteCharacter(
  id: string,
  name: string,
  client: Client,
): Promise<EmbedBuilder> {
  await loadUsers();

  const user = charaDex?.[id];

  const character = user?.characters[name];

  if (!character) {
    return new EmbedBuilder()
      .setDescription(`User or Character ${name} could not be found!`)
      .setColor("Red");
  }
  await deleteThread(id, name, client);

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

export async function deleteAll(id: string, client: Client): Promise<EmbedBuilder> {
  await loadUsers();

  if (!charaDex?.[id]) {
    return new EmbedBuilder()
      .setDescription("User could not be found!")
      .setColor("Red");
  }

  for (const character of await getCharactersObj(id)) {
    await deleteCharacter(id, character.name, client);
  }
  delete charaDex[id];

  await saveUsers();

  return new EmbedBuilder()
    .setDescription("All characters were deleted!")
    .setColor("Green");
}

export function getCharacterEmbed(id: string, name: string) {
  loadUsers();
  console.log(charaDex[id]);
  if (!charaDex[id] || !charaDex[id].characters || !charaDex[id].characters[name]) {
    return new EmbedBuilder()
      .setDescription("User or character could not be found!")
      .setColor("Red");
  }

  const character = charaDex[id].characters[name];
  const charaData = character.optional;
  const houseInfo = houseData[character.house]!;

  const house = `**House** | ${character.house}\n`;
  const docuLink =
    character.docLink === "STAFF NPC"
      ? `**Doc** | STAFF NPC`
      : `**Doc** | [Link](${character.docLink})\n`;
  const partnerDestination = `**Partner Destination** | ${pokehelper.displayName(character.destination)}\n`;
  const roleplayer = `**Roleplayer** | <@${id}>\n`;

  const age = charaData.age ? `**Age** | ${charaData.age}\n` : ``;
  const gender = charaData.gender ? `**Gender** | ${charaData.gender}\n` : ``;
  const pronouns = charaData.pronouns
    ? `**Pronouns** | ${charaData.pronouns}\n`
    : ``;
  const img_link = charaData.img_link ?? undefined;
  const artist_credits = charaData.artist_credits
    ? `**Artist Credits** | ${charaData.artist_credits}\n`
    : ``;
  const bio = charaData.bio ? `\n${charaData.bio}` : ``;

  const embed = new EmbedBuilder()
    .setTitle(`${name}`)
    .setColor(houseInfo.hexcode)
    .setDescription(
      `${roleplayer}${house}${age}${gender}${pronouns}${partnerDestination}${docuLink}${artist_credits}${bio}`,
    )
    .setFooter({
      text: `Want to add more to your OC's profile? Try /character edit!`,
      iconURL: `${houseInfo.iconLink}`,
    })
    .setThumbnail(houseInfo.thumbnail);

  if (img_link) {
    embed.setImage(img_link);
  }

  return embed;
}

export function editCharacter(
  id: string,
  name: string,
  field: string,
  info: string,
) {
  loadUsers();

  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const character: CharacterData = charaDex[id].characters[name].optional;
    character[`${field}`] = info;
  }
  saveUsers();
}

export async function deleteThread(id: string, name: string, client: Client) {
  await loadUsers();
  if (!charaDex?.[id]?.characters[name]) {
    return;
  }
  const character: Character = charaDex[id].characters[name];
  const channel = await client.channels.fetch(character.thread_id!);
  await channel?.delete();
}

export async function createNewForumPost(
  id: string,
  name: string,
  client: Client,
) {
  loadUsers();
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const embed = getCharacterEmbed(id, name);

    const forumChannel = await client.channels.fetch(
      `${process.env.APPROVED_CHANNEL}`,
    );

    if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
      console.log(
        "Error! Forum channel could not be found, or APPROVED_CHANNEL is not a forum!",
      );
      return;
    }

    const thread = await forumChannel!.threads.create({
      name: `${name}`,
      message: {
        embeds: [embed],
      },
    });

    const character: Character = charaDex[id].characters[name];
    character.thread_id = thread.id;
  }
  saveUsers();
}

export async function updateCharaForumPost(
  id: string,
  name: string,
  client: Client,
) {
  loadUsers();
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const thread = (await client.channels.fetch(
      charaDex[id].characters[name].thread_id!,
    )) as AnyThreadChannel;
    const starterMessage = await thread.fetchStarterMessage();
    if (!starterMessage) return;

    const embed = getCharacterEmbed(id, name);

    await starterMessage.edit({
      embeds: [embed],
    });

    const character: Character = charaDex[id].characters[name];
    character.thread_id = thread.id;
  }
  saveUsers();
}
