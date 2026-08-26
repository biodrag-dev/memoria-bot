import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  ActionRowBuilder,
  AnyThreadChannel,
  ChannelType,
  Client,
  ColorResolvable,
  EmbedBuilder,
  resolveColor,
  StringSelectMenuBuilder,
} from "discord.js";

import * as pokehelper from "./pokeHelper";
import * as submitHelper from "./submitHelper";

interface Partner {
  gender?: string;
  ability?: number;
  nickname?: string;
  nature?: string;
  bio?: string;
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

export interface OocPartner {
  registeredOn: Date;
  lastInteracted: Date;
  lastPlayed?: Date;
  lastFed?: Date;
  gender: string;
  ability: number;
  nickname?: string;
  sizeMult: number;
  species: string;
  shiny: boolean;
  nature: string;
  experience: number;
  happiness: number;
  prompt: number;
  reset: Date;
  canFeed: boolean;
  canPlay: boolean;
}

interface Character {
  thread_id?: string;
  name: string;
  house: string;
  badges: personalBadge[];
  docLink: string;
  registeredOn: Date;
  destination: string;
  partner: Partner;
  optional: CharacterData;
  birthday?: Date;
}

interface UserData {
  OocPartner?: OocPartner;
  last_rolled?: Date;
  monthly_rolled?: number;
  booster_role?: string;
  characters: Record<string, Character>;
  birthday?: Date;
}

type CharacterDex = Record<string, UserData>;

const monthlyRerolls = 3;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonsPath = path.resolve(__dirname, "../../../jsons");
const natures = [
  { value: "1", name: "Hardy" },
  { value: "2", name: "Lonely" },
  { value: "3", name: "Adamant" },
  { value: "4", name: "Naughty" },
  { value: "5", name: "Brave" },
  { value: "6", name: "Bold" },
  { value: "7", name: "Docile" },
  { value: "8", name: "Impish" },
  { value: "9", name: "Lax" },
  { value: "10", name: "Relaxed" },
  { value: "11", name: "Modest" },
  { value: "12", name: "Mild" },
  { value: "13", name: "Bashful" },
  { value: "14", name: "Rash" },
  { value: "15", name: "Quiet" },
  { value: "16", name: "Calm" },
  { value: "17", name: "Gentle" },
  { value: "18", name: "Careful" },
  { value: "19", name: "Quirky" },
  { value: "20", name: "Sassy" },
  { value: "21", name: "Timid" },
  { value: "22", name: "Hasty" },
  { value: "23", name: "Jolly" },
  { value: "24", name: "Naive" },
  { value: "25", name: "Serious" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let charaDex: CharacterDex;

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
  Normal: {
    emoji: `<:badge_hero:1539739717472485466>`,
    house: `Victini`,
    name: `Hero`,
  },
  Fire: {
    emoji: `<:badge_ember:1540529540135125083>`,
    house: `Jirachi`,
    name: `Ember`,
  },
  Water: {
    emoji: `<:badge_polaris:1540504883629654158>`,
    house: `Jirachi`,
    name: `Polaris`,
  },

  Ice: {
    emoji: `<:badge_anachronism:1540504888956682261>`,
    house: `Victini`,
    name: `Anachronism`,
  },

  Ground: {
    emoji: `<:badge_origin:1540504886481920080>`,
    house: `Victini`,
    name: `Origin`,
  },

  Bug: {
    emoji: `<:badge_exuviae:1540504884468514877>`,
    house: `Mew`,
    name: `Exuviae`,
  },

  Rock: {
    emoji: `<:badge_altar:1540504885429272697>`,
    house: `Mew`,
    name: `Altar`,
  },

  Fairy: {
    emoji: `<:badge_halcyon:1540504887454863430>`,
    house: `Jirachi`,
    name: `Halcyon`,
  },
  Electric: {
    emoji: `<:badge_cataclysm:1540529542983319562>`,
    house: `Victini`,
    name: `Cataclysm`,
  },
  Grass: {
    emoji: `<:badge_panacea:1539739719494144142>`,
    house: `Mew`,
    name: `Panacea`,
  },
  Fighting: {
    emoji: `<:badge_endurance:1540529539367571626>`,
    house: `Jirachi`,
    name: `Endurance`,
  },
  Poison: {
    emoji: `<:badge_reagant:1539739718478995476>`,
    house: `Mew`,
    name: `Reagent`,
  },
  Flying: {
    emoji: `<:badge_contrivance:1540529540886044672>`,
    house: `Mew`,
    name: `Contrivance`,
  },
  Psychic: {
    emoji: `<:badge_ego:1540529541628305598>`,
    house: `Mew`,
    name: `Ego`,
  },
  Ghost: {
    emoji: `<:badge_hereafter:1539739716264534148>`,
    house: `Jirachi`,
    name: `Hereafter`,
  },
  Dragon: {
    emoji: `<:badge_defiant:1539739714922217572>`,
    house: `Victini`,
    name: `Defiant`,
  },
  Dark: {
    emoji: `<:badge_quietude:1539739712884056154>`,
    house: `Jirachi`,
    name: `Quietude`,
  },
  Steel: {
    emoji: `<:badge_gilded:1540529544283553922>`,
    house: `Victini`,
    name: `Gilded`,
  },
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

const houseData: Record<string, houseData> = {
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

export async function getAllInactive(client: Client): Promise<string[]> {
  await loadUsers();
  const inactiveUsers: string[] = [];
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);

  if (guild) {
    for (const user of Object.keys(charaDex)) {
      if (!guild.members.cache.has(user)) {
        inactiveUsers.push(user);
      }
    }
  }

  return inactiveUsers;
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

  await saveUsers();
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
  await loadUsers();

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

export async function deleteAll(
  id: string,
  client: Client,
): Promise<EmbedBuilder> {
  await loadUsers();

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
  await saveUsers();

  return new EmbedBuilder()
    .setDescription(`All of <@${id}>'s data was deleted!`)
    .setColor("Green");
}

export function getCharacterEmbed(id: string, name: string) {
  loadUsers();
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
  loadUsers();

  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const character: CharacterData = charaDex[id].characters[name].optional;
    character[field as keyof CharacterData] = info;
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
  house: string,
  client: Client,
  npc: boolean,
) {
  loadUsers();
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
      await message.delete().catch(() => {});
    }, 5000);
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
    const embed2 = await getPartnerEmbed(id, name);

    await starterMessage.edit({
      embeds: [embed, embed2],
    });

    const character: Character = charaDex[id].characters[name];
    character.thread_id = thread.id;
  }
  saveUsers();
}

export function getAnruiPartnerEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder();
  const houseInfo = houseData["Victini"]!;

  const species = `**Species** | N/A`;

  const height = `? m | ?'?"`;
  const weight = `? kg | ? lbs`;
  const metOn = `**Met On** | N/A\n`;

  const bio = `Interestingly enough, Champion Anrui lacks a pokemon partner. Or, well— a consistent one, at least. They have worked together with pokemon, yes, but there's never been one that's been there long enough to call 'partner.'
    
A mystery for the ages, one supposes.`;

  embed
    .setTitle(`N/A | ERROR 404: NOT FOUND.`)
    .setColor(resolveColor(houseInfo?.hexcode))
    .setDescription(
      `${species}
${metOn}${bio}`,
    )
    .setFooter({
      text: houseInfo.artist_credits,
      iconURL: `${houseInfo.iconLink}`,
    })
    .addFields(
      {
        name: `Height`,
        value: `${height}`,
        inline: true,
      },
      {
        name: `Weight`,
        value: `${weight}`,
        inline: true,
      },
    )
    .setThumbnail(
      `https://archives.bulbagarden.net/media/upload/0/03/Missingno_Y.png`,
    )
    .setImage(houseInfo.banner);

  return embed;
}

export async function getPartnerEmbed(
  id: string,
  name: string,
): Promise<EmbedBuilder> {
  if (name == "Anrui Tian") {
    return getAnruiPartnerEmbed();
  }
  loadUsers();

  const embed = new EmbedBuilder();
  if (charaDex?.[id]?.characters[name]) {
    const character = charaDex[id].characters[name]!;
    const partner = character.partner as Partner;
    const houseInfo = houseData[character.house]!;

    const species = `**Species** | ${pokehelper.displayName(partner.species)}`;
    const alphaCheck = pokehelper.getSize(partner.sizeMult);
    const shinyCheck =
      partner.shiny == true ? `<:shiny:1539739147001012234>` : ``;

    const pokemon = await pokehelper.findPokemon(partner.species);
    const scaledHeight = pokemon!.height * partner.sizeMult;
    const scaledWeight = pokemon!.weight * Math.pow(partner.sizeMult, 3);

    const height = `${(scaledHeight * 0.1).toFixed(1)} m | ${pokehelper.cmToFeetConversion(scaledHeight * 10)}`;
    const weight = `${(scaledWeight * 0.1).toFixed(1)} kg | ${pokehelper.kgToPounds(scaledWeight * 0.1)} lbs`;
    const nick = partner.nickname ? `${partner.nickname} | ` : ``;
    const metOn = `**Met On** | <t:${Math.floor(new Date(character.registeredOn).getTime() / 1000)}:D>\n`;

    const gender = partner.gender ? `**Gender** | ${partner.gender}\n` : ``;
    const ability = partner.ability
      ? `**Ability** | ${pokehelper.getAbilityName(pokemon!, partner.ability)}\n`
      : ``;
    const nature = partner.nature
      ? `**Nature** | ${getNatureFromValue(partner.nature)}\n`
      : ``;

    const dexEntry = await pokehelper.getRandDexEntry(partner.species);
    const bio = partner.bio ? `\n\n${partner.bio}` : ``;

    const image = await pokehelper.getSprite(
      partner.species,
      partner.gender!,
      partner.shiny,
    );
    embed
      .setTitle(
        `${nick}${`${name}'s ${pokehelper.displayName(partner.species)}`}`,
      )
      .setColor(houseInfo.hexcode)
      .setDescription(
        `${species} ${alphaCheck} ${shinyCheck}
${gender}${ability}${nature}${metOn}${dexEntry}${bio}`,
      )
      .setFooter({
        text: houseInfo.artist_credits,
        iconURL: `${houseInfo.iconLink}`,
      })
      .addFields(
        {
          name: `Height`,
          value: `${height}`,
          inline: true,
        },
        {
          name: `Weight`,
          value: `${weight}`,
          inline: true,
        },
      )
      .setThumbnail(image)
      .setImage(houseInfo.banner);
  }
  return embed;
}

export async function getSetPartnerFields(
  id: string,
  name: string,
): Promise<any[]> {
  loadUsers();
  const options = [];

  if (charaDex?.[id]?.characters[name]) {
    const character = charaDex[id].characters[name]!;
    const partner = character.partner as Partner;
    if (!partner.nature) {
      options.push({ name: `Nature`, value: `nature` });
    }

    if (!partner.ability) {
      options.push({ name: `Ability`, value: `ability` });
    }

    if (!partner.gender) {
      options.push({ name: `Gender`, value: `gender` });
    }
  }
  return options;
}

export async function editPartner(
  id: string,
  name: string,
  field: string,
  data: string,
) {
  loadUsers();
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const partner: Partner = charaDex[id].characters[name].partner;

    switch (field) {
      case "ability":
        partner.ability = Number(data);
        break;
      case "gender":
        partner.gender = data;
        break;
      case "nature":
        partner.nature = data;
        break;
      case "nickname":
        partner.nickname = data;
        break;
      case "bio":
        partner.bio = data;
        break;
    }
  }
  saveUsers();
}

export async function getPartnerDexEmbed(id: string, name: string) {
  const character = charaDex[id]!.characters[name]!;
  const partner = await pokehelper.findPokemon(character.partner.species);

  return pokehelper.pokeEmbedCreate(partner);
}

export function getNatures() {
  return natures;
}

export async function getAbilities(id: string, name: string): Promise<any[]> {
  loadUsers();
  const character = charaDex[id]!.characters[name]!;
  const partner = character.partner as Partner;

  return await pokehelper.getPossibleAbilities(
    partner.species,
    character.destination,
  );
}

export async function getGenders(id: string, name: string): Promise<any[]> {
  loadUsers();
  const character = charaDex[id]!.characters[name]!;
  return await pokehelper.getPossibleGenders(character.destination);
}

export function getNatureFromValue(value: string): string {
  return natures.find((nature) => nature.value === value)?.name!;
}

export function getPossibleBadges(id: string, name: string): any[] {
  loadUsers();
  const house = charaDex[id]!.characters[name]!.house;
  // const arr = [];
  const houseBadges = Object.entries(badges)
    .filter(([_, badge]) => badge.house === house)
    .map(([key, badge]) => ({
      value: key,
      name: `${badge.name} (${key}) | Currently ${hasBadge(id, name, key) === true ? `On` : `Off`}`,
    }));
  return houseBadges;
}

export function toggleBadge(id: string, name: string, badge: string): boolean {
  loadUsers();
  var personalBadges = charaDex[id]!.characters[name]!.badges;

  if (personalBadges.some((b) => b.type === badge)) {
    charaDex[id]!.characters[name]!.badges = personalBadges.filter(
      (b) => b.type !== badge,
    );
    saveUsers();
    return false;
  } else {
    personalBadges.push({
      name: badges[badge]!.name,
      type: badge,
      dateAcquired: new Date(),
    });
    saveUsers();
    return true;
  }
}

export function hasBadge(id: string, name: string, badge: string): boolean {
  loadUsers();
  var personalBadges = charaDex[id]!.characters[name]!.badges;

  if (personalBadges.some((b) => b.type === badge)) {
    return true;
  }
  return false;
}

export function getBadges(id: string, name: string): string {
  loadUsers();
  const charaBadges = charaDex[id]!.characters[name]!.badges;
  const stringBuilder = [];
  for (const badge of charaBadges) {
    const time = new Date(badge.dateAcquired).getTime();
    stringBuilder.push(
      `${badges[badge.type]?.emoji} | ${badge.name} Badge | Acquired <t:${Math.floor(time / 1000)}:D>`,
    );
  }

  return stringBuilder.join("\n");
}

export async function canEvolve(
  id: string,
  name: string,
  embed: EmbedBuilder,
): Promise<boolean> {
  await loadUsers();
  const character = charaDex[id]!.characters[name]!;
  var minCount;
  const badgeCount = character.badges.length;

  if (character.destination === character.partner.species) {
    embed
      .setDescription(
        `You've already fully evolved ${character.partner.nickname ?? pokehelper.displayName(character.partner.species)} by reaching their evolutionary destination!`,
      )
      .setColor("Red");
    return false;
  }

  const evoChain = await pokehelper.getEvolutionPath(character.destination);

  const evoIndex = evoChain.findIndex(
    (evo) => evo === character.partner.species,
  );

  if (evoChain.length === 3) {
    if (evoIndex === 0) {
      minCount = 2;
    } else if (evoIndex === 1) {
      minCount = 4;
    }
  } else if (evoChain.length === 2) {
    minCount = 3;
  }

  if (minCount! <= badgeCount) {
    embed
      .setTitle(`What?`)
      .setDescription(
        `${character.partner.nickname ?? pokehelper.displayName(character.partner.species)} is evolving!`,
      )
      .setThumbnail(
        await pokehelper.getSprite(
          character.partner.species,
          character.partner.gender,
          character.partner.shiny,
        ),
      )
      .setColor("White");
    return true;
  }
  embed
    .setDescription(
      `You don't have enough badges to evolve ${character.partner.nickname ?? pokehelper.displayName(character.partner.species)}! 

Minimum | ${minCount} badges
Current | ${badgeCount} badge(s)`,
    )
    .setColor("Red");
  return false;
}

export async function evolvePartner(
  id: string,
  name: string,
  embed: EmbedBuilder,
) {
  await loadUsers();
  const character = charaDex[id]!.characters[name]!;
  const evoChain = await pokehelper.getEvolutionPath(character.destination);
  const evoIndex = evoChain.findIndex(
    (evo) => evo === character.partner.species,
  );

  pokehelper.displayName(character.partner.species);
  embed
    .setTitle(`Congratulations!`)
    .setDescription(
      `Your ${character.partner.nickname ?? pokehelper.displayName(character.partner.species)} evolved into ${pokehelper.displayName(evoChain[evoIndex + 1]!)}!`,
    )
    .setColor("Green")
    .setThumbnail(
      await pokehelper.getSprite(
        evoChain[evoIndex + 1]!,
        character.partner.gender,
        character.partner.shiny,
      ),
    );
  character.partner.species = evoChain[evoIndex + 1]!;
  await saveUsers();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    BOOSTER ROLE
///////////////////////////////////////////////////////////////////////////////////////////////////////

export function isValidHex(color: string): boolean {
  return /^#?[0-9A-F]{6}$/i.test(color);
}
async function createRole(client: Client, id: string) {
  await loadUsers();
  if (!charaDex[id]) {
    charaDex[id] = { characters: {} };
  }
  if (!charaDex[id]!.booster_role) {
    const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)!;
    const member = await guild.members.fetch(id);
    const role = await guild.roles.create({ name: `${member.user.username}` });
    const targetRole = guild.roles.cache.get(`${process.env.COLOR_ROLE}`)!;
    await role.setPosition(targetRole.position - 1);
    await member.roles.add(role);
    charaDex[id].booster_role = role.id;
    saveUsers();
  }
}
export async function removeBoosterRole(client: Client, id: string) {
  await loadUsers();
  if (charaDex[id]?.booster_role) {
    const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)!;
    const role = await guild.roles.fetch(charaDex?.[id].booster_role);
    role?.delete();
  }
}

export async function boosterColor(
  client: Client,
  id: string,
  color: string,
  secondaryColor: string | null,
): Promise<string> {
  await createRole(client, id);
  if (
    isValidHex(color) === false ||
    (secondaryColor ? isValidHex(secondaryColor) : true) === false
  ) {
    return `Error: not a hex code!`;
  }
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)!;
  const role = guild.roles.cache.get(charaDex[id]?.booster_role!);

  const color1 = color.startsWith("#") ? color : `#${color}`;
  const color2 = secondaryColor
    ? secondaryColor.startsWith("#")
      ? secondaryColor
      : `#${secondaryColor}`
    : null;

  try {
    if (secondaryColor) {
      await role?.edit({
        colors: {
          primaryColor: color1 as ColorResolvable,
          secondaryColor: color2 as ColorResolvable,
        },
      });
    } else {
      await role?.edit({
        colors: {
          primaryColor: color1 as ColorResolvable,
        },
      });
    }
  } catch {
    return `Error: Invalid hex code!`;
  }
  return `Your role's color has been successfully changed!`;
}

export async function boosterName(client: Client, id: string, name: string) {
  await createRole(client, id);
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)!;
  const role = guild.roles.cache.get(charaDex[id]?.booster_role!);

  await role?.edit({
    name: name,
  });
}
export async function getRerolls(id: string): Promise<number> {
  await loadUsers();
  if (!charaDex[id]?.last_rolled) {
    // if never rolled
    return monthlyRerolls;
  } else {
    const lastRolled = new Date(charaDex[id]?.last_rolled);
    const currentDate = new Date();

    if (lastRolled.getMonth() == currentDate.getMonth()) {
      // gets rerolls this month
      return charaDex[id]?.monthly_rolled!;
    }
    return monthlyRerolls;
  }
}

export async function rerollOOC(
  id: string,
  field: string,
): Promise<EmbedBuilder> {
  const roll = Math.floor(Math.random() * 20) + 1;
  const embed = new EmbedBuilder();
  if (charaDex[id]!.monthly_rolled == 0) {
    embed.setDescription(`You're out of monthly rerolls!`);
    return embed;
  }
  const partner = charaDex[id]!.OocPartner!;

  if (field === "shiny") {
    embed
      .setDescription(`🎲 **Result** | ${roll}`)
      .setTitle(`Rolling for Shiny Status (1d20)...`);
    if (roll == 20) {
      embed
        .setColor("#f0ed4c")
        .setFooter({ text: `Oh? Congratulations! It's a shiny!` });
    } else {
      embed.setColor("#3c3d3c").setFooter({ text: "Better luck next time..." });
    }
    partner.shiny = roll == 20;
  } else if (field === "size") {
    var sizeMult;
    if (roll == 20) {
      sizeMult = 2;
    } else {
      sizeMult = Math.random() / 2 + 0.75;
    }

    embed
      .setDescription(
        `🎲 **Result** | ${roll} ${roll === 20 ? `<:alpha:1539739148586455162>` : ``}

${pokehelper.getSize(partner.sizeMult)} -> ${pokehelper.getSize(sizeMult)}`,
      )
      .setTitle(`Rolling for Size (1d20)...`);
    partner.sizeMult = sizeMult;
    if (roll == 20) {
      embed.setColor("#f81a1a").setFooter({
        text: `Oh? Congratulations! It's an alpha!`,
      });
    } else {
      embed.setColor("#3c3d3c").setFooter({ text: `Better luck next time...` });
    }
  }
  charaDex[id]!.monthly_rolled = (await getRerolls(id)) - 1;
  charaDex[id]!.last_rolled = new Date();
  await saveUsers();
  embed.setThumbnail(
    await pokehelper.getSprite(partner.species, partner.gender, partner.shiny),
  );

  return embed;
}

export async function rerollIRP(
  id: string,
  name: string,
  field: string,
): Promise<EmbedBuilder> {
  const roll = Math.floor(Math.random() * 20) + 1;
  const embed = new EmbedBuilder();
  if (charaDex[id]!.monthly_rolled == 0) {
    embed.setDescription(`You're out of monthly rerolls!`);
    return embed;
  }
  const partner = charaDex[id]!.characters[name]!.partner;

  if (field === "shiny") {
    embed
      .setDescription(`🎲 **Result** | ${roll}`)
      .setTitle(`Rolling for Shiny Status (1d20)...`);
    if (roll == 20) {
      embed
        .setColor("#f0ed4c")
        .setFooter({ text: `Oh? Congratulations! It's a shiny!` });
    } else {
      embed.setColor("#3c3d3c").setFooter({ text: "Better luck next time..." });
    }
    partner.shiny = roll == 20;
  } else if (field === "size") {
    var sizeMult;
    if (roll == 20) {
      sizeMult = 2;
    } else {
      sizeMult = Math.random() / 2 + 0.75;
    }

    embed
      .setDescription(
        `🎲 **Result** | ${roll} ${roll === 20 ? `<:alpha:1539739148586455162>` : ``}

${pokehelper.getSize(partner.sizeMult)} -> ${pokehelper.getSize(sizeMult)}`,
      )
      .setTitle(`Rolling for Alpha Status (1d20)...`);
    partner.sizeMult = sizeMult;
    if (roll == 20) {
      embed.setColor("#f81a1a").setFooter({
        text: `Oh? Congratulations! It's an alpha!`,
      });
    } else {
      embed.setColor("#3c3d3c").setFooter({ text: `Better luck next time...` });
    }
  }
  charaDex[id]!.monthly_rolled = (await getRerolls(id)) - 1;
  charaDex[id]!.last_rolled = new Date();
  await saveUsers();
  embed.setThumbnail(await getPartnerSprite(id, name));

  return embed;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    PARTNER MONS
///////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getOOCPartner(
  id: string,
): Promise<OocPartner | undefined> {
  await loadUsers();
  return charaDex[id]?.OocPartner;
}

export async function resetDailies(id: string, prompt: number) {
  await loadUsers();
  charaDex[id]!.OocPartner!.canFeed = true;
  charaDex[id]!.OocPartner!.canPlay = true;
  charaDex[id]!.OocPartner!.reset = new Date();
  charaDex[id]!.OocPartner!.prompt = prompt;
  await saveUsers();
}

export async function setOOCPartner(id: string, partner: OocPartner) {
  await loadUsers();

  if (!charaDex[id]) {
    charaDex[id] = { characters: {} };
  }
  charaDex[id]!.OocPartner = partner;
  await saveUsers();
}

export async function increasedLevel(
  id: string,
  exp: number,
): Promise<Boolean> {
  await loadUsers();
  const oldLevel = Math.min(
    100,
    getLevelFromExp(charaDex[id]!.OocPartner!.experience),
  );
  const newLevel = Math.min(
    100,
    getLevelFromExp(charaDex[id]!.OocPartner!.experience + exp),
  );

  return oldLevel != newLevel;
}

function getLevelFromExp(exp: number): number {
  return Math.min(100, Math.max(Math.floor(Math.cbrt(exp)), 1));
}

export function daysSince(date: Date) {
  const today = new Date();
  const prevDate = new Date(date);
  const diffMs = today.getTime() - prevDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
export async function addExpToPartner(id: string, exp: number) {
  await loadUsers();
  if (charaDex[id]?.OocPartner) {
    //does level increase?
    if (await increasedLevel(id, exp)) {
      charaDex[id].OocPartner.happiness++;
    }
    //decreases happiness if abandoned
    if (daysSince(charaDex[id].OocPartner.lastInteracted) != 0) {
      editHappiness(id, -daysSince(charaDex[id].OocPartner.lastInteracted));
    }
    charaDex[id].OocPartner.lastInteracted == new Date();
    charaDex[id].OocPartner.experience += exp;
    await saveUsers();
  }
}

export async function nextEvoLevelPartner(id: string): Promise<number> {
  await loadUsers();
  const pokemon = await pokehelper.findPokemon(
    charaDex[id]!.OocPartner!.species,
  );
  const evolutions = await pokehelper.getDirectEvolutions(pokemon!);
  //if no possible evolutions/fully evolved
  if (evolutions.size == 0) {
    return -1;
  }
  const evoChain = await pokehelper.getEvolutionPath(pokemon!.name);
  const evoIndex = evoChain.findIndex((evo) => evo === pokemon!.name);

  if (evoIndex == 0) {
    return 25;
  } else if (evoIndex == 1) {
    return 50;
  }

  //if no partner
  return 0;
}

export async function canEvoOOCPartner(id: string) {
  await loadUsers();
  const evoLevel = await nextEvoLevelPartner(id);
  const embed = new EmbedBuilder();
  const partnerName =
    charaDex[id]!.OocPartner!.nickname ??
    pokehelper.displayName(charaDex[id]!.OocPartner!.species);
  if (evoLevel > getLevelFromExp(charaDex[id]!.OocPartner!.experience)) {
    embed
      .setDescription(
        `You can't evolve ${partnerName} until they hit **level ${evoLevel}**!`,
      )
      .setTitle("Hold it!")
      .setColor("Red");
    return { embeds: [embed], ephemeral: true };
  } else if (evoLevel == -1) {
    embed
      .setDescription(
        `No further evolutions can be found! If this is a bug, go to <#1527299700699566162> for help!`,
      )
      .setTitle("Your partner is fully evolved!")
      .setColor("Grey");
    return { embeds: [embed], ephemeral: true };
  } else {
    const pokemon = await pokehelper.findPokemon(
      charaDex[id]!.OocPartner!.species,
    );
    const evolutions = await pokehelper.getDirectEvolutions(pokemon!);

    embed
      .setTitle(`What?`)
      .setDescription(`${partnerName} is evolving!`)
      .setThumbnail(
        await pokehelper.getSprite(
          charaDex[id]!.OocPartner!.species,
          charaDex[id]!.OocPartner!.gender,
          charaDex[id]!.OocPartner!.shiny,
        ),
      )
      .setColor("White");

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`starter_evolution:${id}`)
        .setPlaceholder(`select an evolution...`)
        .addOptions(
          Array.from(evolutions).map((option) => ({
            label: `${pokehelper.displayName(option)}`,
            value: option,
          })),
        ),
    );
    return { embeds: [embed], components: [row], ephemeral: true };
  }
}

export async function changeSpecies(id: string, species: string) {
  await loadUsers();
  charaDex[id]!.OocPartner!.species = species;
  await saveUsers();
  const embed = new EmbedBuilder();
  const partnerName =
    charaDex[id]!.OocPartner!.nickname ??
    pokehelper.displayName(charaDex[id]!.OocPartner!.species);
  embed
    .setDescription(
      `Your ${partnerName} evolved into a ${pokehelper.displayName(species)}!`,
    )
    .setTitle("Congratulations!")
    .setThumbnail(
      await pokehelper.getSprite(
        charaDex[id]!.OocPartner!.species,
        charaDex[id]!.OocPartner!.gender,
        charaDex[id]!.OocPartner!.shiny,
      ),
    )
    .setColor("White");
  return { embeds: [embed], ephemeral: true };
}

export async function setNick(id: string, nick: string | undefined) {
  await loadUsers();
  if (charaDex[id]?.OocPartner) {
    if (nick) {
      charaDex[id]!.OocPartner.nickname = nick;
    } else {
      delete charaDex[id]!.OocPartner.nickname;
    }
    await saveUsers();
  }
}
export async function editHappiness(id: string, affectionChange: number) {
  await loadUsers();
  if (charaDex[id]?.OocPartner) {
    charaDex[id].OocPartner.happiness = Math.max(
      getLevelFromExp(charaDex[id].OocPartner.experience),
      charaDex[id].OocPartner.happiness + affectionChange,
    );
    await saveUsers();
  }
}

export async function fedPartner(id: string, affection: number) {
  await loadUsers();
  if (charaDex[id]?.OocPartner) {
    charaDex[id].OocPartner.canFeed = false;
    charaDex[id].OocPartner.happiness += affection;
    charaDex[id].OocPartner.lastInteracted == new Date();
    await saveUsers();
  }
}

export async function playWithPartner(id: string) {
  await loadUsers();
  if (charaDex[id]?.OocPartner) {
    charaDex[id].OocPartner.canPlay = false;
    charaDex[id].OocPartner.happiness += 1;
    charaDex[id].OocPartner.lastInteracted == new Date();
    await saveUsers();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    BIRTHDAY COMMANDS
///////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getAllPersonalBdays(
  client: Client,
  id: string,
): Promise<EmbedBuilder> {
  await loadUsers();
  const embed = new EmbedBuilder();

  if (!charaDex[id]) {
    embed.setDescription("You don't have any birthdays set!");
    return embed;
  }

  const date = new Date(charaDex[id]?.birthday ?? 0);
  const personalBday = !charaDex[id]?.birthday
    ? `No birthday has been set!`
    : `${months[date.getMonth()]} ${date.getDate()} | Your birthday!`;

  var characters: string[] = [];
  if (charaDex[id]) {
    if (Object.entries(charaDex[id].characters).length > 0) {
      const bdays = Object.entries(charaDex[id].characters).sort(
        ([charaA, infoA], [charaB, infoB]) => {
          const dateA = new Date(infoA.birthday ?? 9999);
          const dateB = new Date(infoB.birthday ?? 9999);

          return (
            (dateA.getMonth() - dateB.getMonth()) * 40 +
            (dateA.getDay() - dateB.getDay())
          );
        },
      );
      characters = await Promise.all(
        bdays.map(async ([key, info]) => {
          const date = info.birthday ? new Date(info.birthday) : `N/A`;
          return `${date instanceof Date ? `${months[date.getMonth()]} ${date.getDate()}` : date} | ${key}`;
        }),
      );
    }
  }
  const person = await client.users.fetch(id);
  const avatar = person.displayAvatarURL({ size: 1024 });

  embed
    .setDescription(
      `**Personal**
${personalBday}

**Character Birthday(s)**
${characters.length == 0 ? `No characters are registered! Why don't you change that?` : characters.join("\n")}`,
    )
    .setTitle(`Your birthday(s)!`)
    .setImage(
      `https://64.media.tumblr.com/cda9db14ddc868b60551e28b0bcb8a06/tumblr_pevzh6YDZ71x5dih0o1_540.gif`,
    )
    .setFooter({ text: `banner by @setamo-arts on tumblr` })
    .setColor("#9fd3b6")
    .setThumbnail(avatar);
  return embed;
}

export async function getOOCBirthdays(
  month: number,
  day: number,
): Promise<string[]> {
  await loadUsers();
  const bdays = Object.entries(charaDex)
    .filter(([_, info]) => {
      if (info.birthday) {
        const date = new Date(info.birthday);
        return date.getMonth() === month && date.getDate() === day;
      }
    })
    .map(([key, _]) => key);

  return bdays;
}

export async function getOOCMonthBirthday(
  month: number,
): Promise<EmbedBuilder> {
  await loadUsers();
  const bdays = Object.entries(charaDex)
    .filter(([_, info]) => {
      if (info.birthday) {
        const date = new Date(info.birthday);
        return date.getMonth() === month;
      }
      return false;
    })
    .sort(([_, a], [__, b]) => {
      const dateA = new Date(a.birthday!);
      const dateB = new Date(b.birthday!);

      return (
        (dateA.getMonth() - dateB.getMonth()) * 40 +
        (dateA.getDay() - dateB.getDay())
      );
    });

  const users = await Promise.all(
    bdays.map(async ([key, info]) => {
      const date = new Date(info.birthday!);
      return `${months[date.getMonth()]} ${date.getDate()} | <@${key}>`;
    }),
  );
  const embed = new EmbedBuilder();
  const list =
    users.length != 0
      ? users.join("\n")
      : `No birthdays are registered for this month.`;
  embed
    .setDescription(list)
    .setTitle(`${months[month]} | Upcoming Birthdays!`)
    .setImage(
      `https://i.pinimg.com/originals/b7/f7/88/b7f788e000ffb2854a98d937b8a46593.gif`,
    )
    .setFooter({ text: `banner by @mae_1031 on danbooru` })
    .setColor("#6ed3ba");
  return embed;
}

export async function getOOCAllBirthdays(): Promise<EmbedBuilder> {
  await loadUsers();
  const bdays = Object.entries(charaDex)
    .filter(([_, info]) => {
      if (info.birthday) {
        return true;
      }
      return false;
    })
    .sort(([_, a], [__, b]) => {
      const dateA = new Date(a.birthday!);
      const dateB = new Date(b.birthday!);

      return (
        (dateA.getMonth() - dateB.getMonth()) * 40 +
        (dateA.getDay() - dateB.getDay())
      );
    });

  const users = await Promise.all(
    bdays.map(async ([key, info]) => {
      const date = new Date(info.birthday!);
      return `${months[date.getMonth()]} ${date.getDate()} | <@${key}>`;
    }),
  );
  const embed = new EmbedBuilder();
  const list =
    users.length != 0
      ? users.join("\n")
      : `No birthdays are registered. Why don't you change that?`;
  embed
    .setDescription(list)
    .setTitle(`Year | Upcoming Birthdays!`)
    .setImage(
      `https://i.pinimg.com/originals/83/4c/f3/834cf38ce6a44974aad1d522f2194025.gif`,
    )
    .setFooter({ text: `banner by @1041uuu on tumblr` })
    .setColor("#e94b46");
  return embed;
}

export async function setBday(
  id: string,
  month: number,
  day: number,
): Promise<EmbedBuilder> {
  await loadUsers();
  try {
    const bday = new Date(0);
    bday.setMonth(month, day);

    if (!charaDex[id]) {
      charaDex[id] = {
        characters: {},
      };
    }

    charaDex[id].birthday = bday;
    await saveUsers();
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `Your Birthday has been set for ${months[month]} ${day}!`,
      );
    return embed;
  } catch {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`Error: Invalid Date!`);
    return embed;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    CHARACTER BIRTHDAY COMMANDS
///////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getCharaBdays(
  month: number,
  day: number,
): Promise<{ userId: string; charaName: string }[]> {
  await loadUsers();
  const bdays: { userId: string; charaName: string }[] = [];

  for (const [userId, userData] of Object.entries(charaDex)) {
    for (const [charaName, character] of Object.entries(userData.characters)) {
      if (character.birthday) {
        const date = new Date(character.birthday);

        if (date.getMonth() === month && date.getDate() === day) {
          bdays.push({ userId, charaName });
        }
      }
    }
  }

  return bdays;
}

export async function getCharaMonthBdays(month: number): Promise<EmbedBuilder> {
  await loadUsers();

  const bdays: { userId: string; character: Character }[] = [];
  for (const [userId, userData] of Object.entries(charaDex)) {
    for (const character of Object.values(userData.characters)) {
      if (character.birthday) {
        const date = new Date(character.birthday);
        if (date.getMonth() === month) {
          bdays.push({ userId, character });
        }
      }
    }
  }

  bdays.sort((a, b) => {
    const dateA = new Date(a.character.birthday!);
    const dateB = new Date(b.character.birthday!);
    return (
      (dateA.getMonth() - dateB.getMonth()) * 40 +
      (dateA.getDay() - dateB.getDay())
    );
  });

  const users = bdays.map(({ userId, character }) => {
    const date = new Date(character.birthday!);
    return `${months[date.getMonth()]} ${date.getDate()} | ${character.name} | <@${userId}>`;
  });

  const embed = new EmbedBuilder();
  const list =
    users.length !== 0
      ? users.join("\n")
      : `No character birthdays are registered for this month. Why don't you change that?`;
  embed
    .setDescription(list)
    .setTitle(`${months[month]} | Upcoming Character Birthdays!`)
    .setImage(
      `https://i.pinimg.com/originals/ce/7f/35/ce7f35ec213d896247c7c2e8620d81f9.gif`,
    )
    .setFooter({ text: `banner by @decomposedmaw on twitter` })
    .setColor("#6eaf66");

  return embed;
}

export async function getCharaAllBdays(): Promise<EmbedBuilder> {
  await loadUsers();

  const bdays: { userId: string; character: Character }[] = [];
  for (const [userId, userData] of Object.entries(charaDex)) {
    for (const character of Object.values(userData.characters)) {
      if (character.birthday) {
        bdays.push({ userId, character });
      }
    }
  }

  bdays.sort((a, b) => {
    const dateA = new Date(a.character.birthday!);
    const dateB = new Date(b.character.birthday!);
    return (
      (dateA.getMonth() - dateB.getMonth()) * 40 +
      (dateA.getDay() - dateB.getDay())
    );
  });

  const users = bdays.map(({ userId, character }) => {
    const date = new Date(character.birthday!);
    return `${months[date.getMonth()]} ${date.getDate()} | ${character.name} | <@${userId}>`;
  });

  const embed = new EmbedBuilder();
  const list =
    users.length != 0
      ? users.join("\n")
      : `No birthdays are registered. Why don't you change that?`;
  embed
    .setDescription(list)
    .setTitle(`Year | Upcoming Character Birthdays!`)
    .setImage(
      `https://i.pinimg.com/originals/35/49/be/3549beaae0ba185e62d53e57144caa0d.gif`,
    )
    .setFooter({ text: `banner by @1041uuu on tumblr` })
    .setColor("#ce3c3c");
  return embed;
}

export async function setCharaBday(
  id: string,
  name: string,
  month: number,
  day: number,
): Promise<EmbedBuilder> {
  await loadUsers();
  try {
    const bday = new Date(0);
    bday.setMonth(month, day);

    charaDex[id]!.characters[name]!.birthday = bday;
    await saveUsers();
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${name}'s birthday has been set for ${months[month]} ${day}!`,
      );
    return embed;
  } catch {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`Error: Invalid Date!`);
    return embed;
  }
}
