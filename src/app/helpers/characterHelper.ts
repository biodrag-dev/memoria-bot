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
  gender: string;
  ability: number;
  nickname?: string;
  sizeMult: number;
  species: string;
  shiny: boolean;
  nature: string;
  experience: number;
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
}

interface UserData {
  OocPartner?: OocPartner;
  last_rolled?: Date;
  monthly_rolled?: number;
  booster_role?: string;
  characters: Record<string, Character>;
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
    emoji: `<:ea_badge_hero:1536514177466638406>`,
    house: `Victini`,
    name: `Hero`,
  },
  Fire: {
    emoji: `<:ea_badge_ember:1536602424662298675>`,
    house: `Jirachi`,
    name: `Ember`,
  },
  Water: {
    emoji: `<:ea_badge_polaris:1538306037877047386>`,
    house: `Jirachi`,
    name: `Polaris`,
  },

  Ice: {
    emoji: `<:ea_badge_anachronism:1538306091681710121>`,
    house: `Victini`,
    name: `Anachronism`,
  },

  Ground: {
    emoji: `<:ea_badge_origin:1538306279867555911>`,
    house: `Victini`,
    name: `Origin`,
  },

  Bug: {
    emoji: `<:ea_badge_exuviae:1538306151547142275>`,
    house: `Mew`,
    name: `Exuviae`,
  },

  Rock: {
    emoji: `<:ea_badge_altar:1538306224507060304>`,
    house: `Mew`,
    name: `Altar`,
  },

  Fairy: {
    emoji: `<:ea_badge_halcyon:1538306344619221106>`,
    house: `Jirachi`,
    name: `Halcyon`,
  },
  Electric: {
    emoji: `<:ea_badge_cataclysm:1538101885544824832>`,
    house: `Victini`,
    name: `Cataclysm`,
  },
  Grass: {
    emoji: `<:ea_badge_panacea:1536514286564671588>`,
    house: `Mew`,
    name: `Panacea`,
  },
  Fighting: {
    emoji: `<:ea_badge_reagant:1536596517425774622>`,
    house: `Jirachi`,
    name: `Endurance`,
  },
  Poison: {
    emoji: `<:ea_badge_reagant:1536514217602064464>`,
    house: `Mew`,
    name: `Reagent`,
  },
  Flying: {
    emoji: `<:ea_badge_contrivance:1538101905513914459>`,
    house: `Mew`,
    name: `Contrivance`,
  },
  Psychic: {
    emoji: `<:ea_badge_ego:1536597936178204743>`,
    house: `Mew`,
    name: `Ego`,
  },
  Ghost: {
    emoji: `<:ea_badge_hereafter:1536514601724674098>`,
    house: `Jirachi`,
    name: `Hereafter`,
  },
  Dragon: {
    emoji: `<:ea_badge_defiant:1536514532456013845>`,
    house: `Victini`,
    name: `Defiant`,
  },
  Dark: {
    emoji: `<:ea_badge_quietude:1536515799328755812>`,
    house: `Jirachi`,
    name: `Quietude`,
  },
  Steel: {
    emoji: `<:ea_badge_gilded:1536599347200921610>`,
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
  artist_credits: string;
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
  await submitHelper.approveDestination(submission.partner.toLowerCase());
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);
  const member = await guild!.members.fetch(user);
  await member.roles.add(`${process.env.ROLEPLAYER_ROLE}`);

  switch (submission.house) {
    case "Victini":
      await member.roles.add(`${process.env.VICTINI_ROLE}`);
      break;
    case "Jirachi":
      await member.roles.add(`${process.env.JIRACHI_ROLE}`);
      break;
    case "Mew":
      await member.roles.add(`${process.env.MEW_ROLE}`);
      break;
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
  await submitHelper.deleteDestination(evoDestination);

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
  const bio = charaData.bio ? `\n${charaData.bio}\n` : ``;
  const badges = `${getBadges(id, name)}`;

  const embed = new EmbedBuilder()
    .setTitle(`${name}`)
    .setColor(houseInfo.hexcode)
    .setDescription(
      `${roleplayer}${house}${age}${gender}${pronouns}${partnerDestination}${docuLink}${artist_credits}${bio}${badges === "" ? `` : `\n**Badges**\n${badges}`}`,
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
) {
  loadUsers();
  if (!charaDex?.[id]?.characters[name]) {
    return;
  } else {
    const embed = getCharacterEmbed(id, name);
    const embed2 = await getPartnerEmbed(id, name);

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
      appliedTags: [`${houseData[house]?.tagid}`],
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

export async function getPartnerEmbed(
  id: string,
  name: string,
): Promise<EmbedBuilder> {
  loadUsers();

  const embed = new EmbedBuilder();
  if (charaDex?.[id]?.characters[name]) {
    const character = charaDex[id].characters[name]!;
    const partner = character.partner as Partner;
    const houseInfo = houseData[character.house]!;

    const species = `**Species** | ${pokehelper.displayName(partner.species)}`;
    const alphaCheck = pokehelper.getSize(partner.sizeMult);
    const shinyCheck =
      partner.shiny == true ? `<:ea_shinyicon:1533355848217399419>` : ``;

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
  client: Client,
  id: string,
  field: string,
): Promise<EmbedBuilder> {
  return new EmbedBuilder();
}

export async function rerollIRP(
  client: Client,
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
        `🎲 **Result** | ${roll} ${roll === 20 ? `<:ea_alphaicon:1533355784769896459>` : ``}

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

export async function setOOCPartner(id: string, partner: OocPartner) {
  await loadUsers();

  if (!charaDex[id]) {
    charaDex[id] = { characters: {} };
  }
  charaDex[id]!.OocPartner = partner;
  await saveUsers();
}
