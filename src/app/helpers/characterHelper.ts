import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  AnyThreadChannel,
  ChannelType,
  Client,
  ColorResolvable,
  EmbedBuilder,
  resolveColor,
  TextChannel,
} from "discord.js";

import * as pokehelper from "./pokeHelper";
import * as submitHelper from "./extraHelpers/submitHelper";

interface CharacterData {
  age?: string;
  gender?: string;
  bio?: string;
  pronouns?: string;
  img_link?: string;
  artist_credits?: string;
}

export interface Character {
  thread_id?: string;
  name: string;
  docLink: string;
  optional: CharacterData;
  birthday?: Date;
  balance: number;
  inventory: inventoryItem[];
}

export interface inventoryItem {
  id: number;
  category: number;
  quantity: number;
}

type CharacterDex = Record<string, Character>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonsPath = path.resolve(__dirname, "../../../jsons");

let charaDex: CharacterDex = await loadUsers();

interface personalBadge {
  name: string;
  type: string;
  dateAcquired: Date;
}
interface badgeData {
  emoji: string;
  name: string;
  house: string;
}
const badges: Record<string, badgeData> = {
  
};

interface houseData {
  hexcode: ColorResolvable;
  iconLink: string;
  thumbnail: string;
  banner: string;
  tagid: string;
  stafftagid: string;
  artist_credits: string;
  roleid: string;
}

export const houseData: Record<string, houseData> = {
  Victini: {
    hexcode: "#ce1b1b",
    iconLink: "https://play.pokemonshowdown.com/sprites/bwicons/494.png",
    thumbnail:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/494.png",
    banner:
      "https://64.media.tumblr.com/4c989428ba947bc4966e07e76d36bd28/118ec01107834a73-07/s540x810/5c2aa6ffdba2c64d3deb6fb0a646313eb247c561.gif",
    artist_credits: "banner by @waneella on tumblr",
    tagid: "1536506597579292803",
    stafftagid: `1540434054187327620`,
    roleid: `1534651799816900618`,
  },

  Mew: {
    hexcode: "#3473fa",
    iconLink: "https://play.pokemonshowdown.com/sprites/bwicons/151.png",
    thumbnail:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    tagid: "1536506628667478096",
    banner:
      "https://i.pinimg.com/originals/33/00/37/330037e99d9692d6b6a290296a33bdca.gif",
    artist_credits: "banner by @1041uuu on tumblr",
    stafftagid: `1540434113197248552`,
    roleid: `1534651892024737893`,
  },

  Jirachi: {
    hexcode: "#FFC969",
    iconLink: "https://play.pokemonshowdown.com/sprites/bwicons/385.png",
    thumbnail:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png",
    tagid: "1536506614285082676",
    banner:
      "https://i.pinimg.com/originals/82/19/ad/8219adaa7148d1dcd477a4d728f97b85.gif",
    artist_credits: "banner by @anasabdin on tumblr",
    stafftagid: `1540434069483950171`,
    roleid: `1534651864111513792`,
  },
};

function loadUsers() {
  const data = fs.readFileSync(`${jsonsPath}/users.json`, "utf8");
  return JSON.parse(data) as CharacterDex;
}

function saveUsers() {
  fs.writeFileSync(
    `${jsonsPath}/users.json`,
    JSON.stringify(charaDex, null, 2),
    "utf8",
  );
}

export function getUsers(): CharacterDex {
  return charaDex;
}

export function saveUsersExternal(characters: CharacterDex) {
  charaDex = characters;
  fs.writeFileSync(
    `${jsonsPath}/users.json`,
    JSON.stringify(charaDex, null, 2),
    "utf8",
  );
}

export async function getAllInactive(client: Client): Promise<string[]> {
  const inactiveUsers: string[] = [];
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);

  if (guild) {
    for (const user of Object.keys(charaDex)) {
      try {
        const person = await guild.members.fetch(user);
      } catch {
        inactiveUsers.push(user);
      }
    }
  }

  return inactiveUsers;
}

export function getCharacter(id: string, name: string): Character {
  return charaDex[id]!.characters[name]!;
}

export function getCharactersObj(id: string): Character[] {
  const characters: Character[] = [];

  if (!charaDex?.[id]) {
    return characters;
  }

  for (const character of Object.values(charaDex[id].characters)) {
    characters.push(character);
  }

  return characters;
}

export function getCharacterNames(id: string): string[] {
  const names: string[] = [];

  if (!charaDex?.[id]) {
    return names;
  }

  for (const character of Object.values(charaDex[id].characters)) {
    names.push(character.name);
  }

  return names;
}

export async function getPartnerSprite(id: string, name: string) {
  const character = charaDex[id]!.characters[name]!;
  const partner = character.partner as Partner;
  const image = await pokehelper.getSprite(
    partner.species,
    partner.gender!,
    partner.shiny,
  );
  return image;
}

export async function registerCharacter(user: string, client: Client) {
  const submission = await submitHelper.getSubmit(user);
  const pokemon = await pokehelper.findPokemon(submission.partner);

  const basemon = await pokehelper.findBaseMon(pokemon);

  var sizeMult;
  if (submission.alphaRoll == 20) {
    sizeMult = 2;
  } else {
    sizeMult = Math.random() / 2 + 0.75;
  }

  const learnedMoves = pokehelper.learnedMoves(pokemon!, -1, 5);
  const moves: Record<string, string> = {};

  for (const move of learnedMoves) {
    moves[move.move.name] = await pokehelper.moveDisplayName(move.move.name);
  }

  const charaData: CharacterData = {};
  const character: Character = {
    name: submission.name,
    house: submission.house,
    badges: [],
    registeredOn: new Date(),
    destination: submission.partner.toLowerCase(),
    partner: {
      exp: 125,
      nickname: undefined,
      shiny: submission.shinyRoll == 20,
      species:
        submission.docLink != "STAFF NPC" ? basemon.name : submission.partner,
      learnedMoves: moves,
      specialMoves: {},
      sizeMult: sizeMult,
    },
    docLink: submission.docLink,
    optional: charaData,
    balance: 1000,
    inventory: [],
  };
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);
  const member = await guild!.members.fetch(user);
  await member.roles.add(`${process.env.ROLEPLAYER_ROLE}`);

  if (submission.docLink != "STAFF NPC") {
    await member.roles.add(houseData[submission.house]?.roleid!);
    await submitHelper.approveDestination(submission.partner.toLowerCase());
  }

  if (!charaDex[user]) {
    charaDex[user] = {
      characters: {},
    };
  }
  charaDex![user].characters[submission.name] = character;

  saveUsers();
  await createNewForumPost(
    `${user}`,
    `${submission.name}`,
    submission.house,
    client,
    submission.docLink == "STAFF NPC",
  );
}

export async function deleteCharacter(
  id: string,
  name: string,
  client: Client,
): Promise<EmbedBuilder> {
  const user = charaDex?.[id];

  const character = user?.characters[name];

  if (!character) {
    return new EmbedBuilder()
      .setDescription(`User or Character ${name} could not be found!`)
      .setColor("Red");
  }

  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);
  const guildMember = await guild!.members.fetch(id);

  switch (character.house) {
    case "Victini":
      await guildMember.roles.remove(`${process.env.VICTINI_ROLE}`);
      break;
    case "Jirachi":
      await guildMember.roles.remove(`${process.env.JIRACHI_ROLE}`);
      break;
    case "Mew":
      await guildMember.roles.remove(`${process.env.MEW_ROLE}`);
      break;
  }

  await deleteThread(id, name, client);

  const evoDestination = character.destination;
  if (character.docLink != "STAFF NPC") {
    await submitHelper.deleteDestination(evoDestination);
  }

  delete user.characters[name];

  //if no more characters, remove rper role
  if (Object.keys(user.characters).length === 0) {
    await guildMember.roles.remove(`${process.env.ROLEPLAYER_ROLE}`);
  }

  saveUsers();

  const displayDestination =
    evoDestination.charAt(0).toUpperCase() +
    evoDestination.slice(1).toLowerCase();

  return new EmbedBuilder()
    .setDescription(
      `Character ${name} was deleted along with destination ${displayDestination}!`,
    )
    .setColor("Green");
}

export async function deleteAll(
  id: string,
  client: Client,
): Promise<EmbedBuilder> {
  if (!charaDex?.[id]) {
    return new EmbedBuilder()
      .setDescription("User could not be found!")
      .setColor("Red");
  }

  for (const character of await getCharactersObj(id)) {
    await deleteCharacter(id, character.name, client);
  }

  if (charaDex?.[id].booster_role) {
    const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)!;
    const role = await guild.roles.fetch(charaDex?.[id].booster_role);
    role?.delete();
  }
  delete charaDex[id];
  const reserve = await submitHelper.getReserveOfUser(id);
  if (reserve.length != 0) {
    submitHelper.deleteDestination(reserve[0]!);
  }
  saveUsers();

  return new EmbedBuilder()
    .setDescription(`All of <@${id}>'s data was deleted!`)
    .setColor("Green");
}

export function getCharacterEmbed(id: string, name: string) {
  if (
    !charaDex[id] ||
    !charaDex[id].characters ||
    !charaDex[id].characters[name]
  ) {
    return new EmbedBuilder()
      .setDescription("User or character could not be found!")
      .setColor("Red");
  }

  const character = charaDex[id].characters[name];
  const charaData = character.optional;
  const houseInfo = houseData[character.house]!;

  const house = `**House** | <@&${houseInfo.roleid}>\n`;
  const docuLink =
    character.docLink === "STAFF NPC"
      ? `**Doc** | STAFF NPC\n`
      : `**Doc** | [Link](${character.docLink})\n`;
  const partnerDestination =
    character.docLink === "STAFF NPC"
      ? character.name === "Anrui Tian"
        ? `**Partner** | N/A\n`
        : `**Partner** | ${pokehelper.displayName(character.destination)}\n`
      : `**Partner Destination** | ${pokehelper.displayName(character.destination)}\n`;
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
  const bio = charaData.bio ? `\n${charaData.bio}\n` : ``;
  const badges = `${getBadges(id, name)}`;

  const embed = new EmbedBuilder()
    .setTitle(`${name}`)
    .setColor(houseInfo.hexcode)
    .setDescription(
      `${house}${roleplayer}${age}${gender}${pronouns}${partnerDestination}${docuLink}${artist_credits}${bio}${badges === "" ? `` : `\n**Badges**\n${badges}`}`,
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
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const character: CharacterData = charaDex[id].characters[name].optional;
    character[field as keyof CharacterData] = info;
  }
  saveUsers();
}

export async function deleteThread(id: string, name: string, client: Client) {
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
  house: string,
  client: Client,
  npc: boolean,
) {
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const embed = getCharacterEmbed(id, name);
    const embed2 = await getPartnerEmbed(id, name);

    var forumChannel;

    if (npc == false) {
      forumChannel = await client.channels.fetch(
        `${process.env.APPROVED_CHANNEL}`,
      );
    } else {
      forumChannel = await client.channels.fetch(
        `${process.env.STAFF_NPC_CHANNEL}`,
      );
    }

    if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
      console.log(
        "Error! Forum channel could not be found, or APPROVED_CHANNEL is not a forum!",
      );
      return;
    }

    const thread = await forumChannel!.threads.create({
      name: `${name}`,
      appliedTags: [
        `${npc ? houseData[house]?.stafftagid : houseData[house]?.tagid}`,
      ],
      message: {
        embeds: [embed, embed2],
      },
    });

    const character: Character = charaDex[id].characters[name];
    character.thread_id = thread.id;
    const message = await thread.send(`<@${id}>`);

    setTimeout(async () => {
      await message.delete().catch(() => { });
    }, 5000);
  }
  saveUsers();
}

export async function updateCharaForumPost(
  id: string,
  name: string,
  client: Client,
) {
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const thread = (await client.channels.fetch(
      charaDex[id].characters[name].thread_id!,
    )) as AnyThreadChannel;
    const starterMessage = await thread.fetchStarterMessage();
    if (!starterMessage) return;

    const embed = getCharacterEmbed(id, name);
    const embed2 = await getPartnerEmbed(id, name);

    await starterMessage.edit({
      embeds: [embed, embed2],
    });

    const character: Character = charaDex[id].characters[name];
    character.thread_id = thread.id;
  }
  saveUsers();
}


export async function addCurrency(
  client: Client,
  id: string,
  name: string,
  amount: number,
) {
  const character = charaDex[id]!.characters[name]!;

  // removes buff if expired
  const expiresDate = character.buff ? new Date(character.buff.expires) : new Date();
  const today = new Date();
  const timeDiff = today.getTime() - expiresDate.getTime();
  if(character.buff && timeDiff < 0){
    delete character.buff;
  }

  const oldExp = character.partner.exp;
  const newExp = character.partner.exp + (amount * (character.buff?.expBuff ?? 1));
  character.balance += amount * (character.buff?.moneyBuff ?? 1);
  character.partner.exp = newExp;

  if (increasedLevel(oldExp, newExp)) {
    const pokemon = await pokehelper.findPokemon(character.partner.species);
    const learnedMoves = pokehelper.learnedMoves(
      pokemon!,
      getLevelFromExp(oldExp),
      getLevelFromExp(newExp),
    );
    const partner = character.partner;

    const channel = (await client.channels.fetch(
      `${process.env.IRP_NOTIFICATIONS}`,
    )) as TextChannel;
    for (const move of learnedMoves) {
      if ((await knowsMove(id, name, move.move.name)) === false) {
        character.partner.learnedMoves[move.move.name] =
          await pokehelper.moveDisplayName(move.move.name);

        const embed = new EmbedBuilder();
        embed
          .setTitle("Congratulations!")
          .setThumbnail(
            await pokehelper.getSprite(
              partner.species,
              partner.gender,
              partner.shiny,
            ),
          )
          .setFooter({
            text: `${character.name}'s partner | lv. ${getLevelFromExp(newExp)}`,
          })
          .setDescription(
            `${partner.nickname ?? pokehelper.displayName(partner.species)} learned ${partner.learnedMoves[move.move.name]}!`,
          )
          .setColor(houseData[character.house]!.hexcode);
        channel.send({ content: `<@${id}>`, embeds: [embed] });
      }
    }
    await updateCharaForumPost(id, name, client);
  }
  saveUsers();
}

export function changeBalance(id: string, name: string, amount: number) {
  charaDex[id]!.characters[name]!.balance += amount;
  saveUsers();
}

export function setBalance(id: string, name: string, amount: number) {
  charaDex[id]!.characters[name]!.balance = amount;
  saveUsers();
}