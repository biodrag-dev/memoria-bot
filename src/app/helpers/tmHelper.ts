import {
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import Pokedex, { Move, Pokemon, Type } from "pokedex-promise-v2";
import * as characterHelper from "./characterHelper";
import { months } from "./extraHelpers/birthdayHelper";
const P = new Pokedex();

export const moves = (await P.getMovesList()).results.map((resource) => {
  return resource.name;
});

type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

type SignatureMove = {
  name: string;
  legendary: boolean;
};

const tmEmojis: Record<PokemonType, string> = {
  normal: "<:tm_normal:1545892659951050793>",
  fire: "<:tm_fire:1545892650232586320>",
  water: "<:tm_water:1545892649095925780>",
  grass: "<:tm_grass:1545892647955333141>",
  electric: "<:tm_electric:1545892645522645012>",
  psychic: "<:tm_psychic:1545892643941384202>",
  ice: "<:tm_ice:1545892642817179828>",
  dragon: "<:tm_dragon:1545892641676468245>",
  dark: "<:tm_dark:1545892640996859965>",
  fairy: "<:tm_fairy:1545892640111988877>",
  flying: "<:tm_flying:1545892658394964068>",
  fighting: "<:tm_fighting:1545892659447472218>",
  poison: "<:tm_poison:1545892657409294437>",
  ground: "<:tm_ground:1545892656289284107>",
  rock: "<:tm_rock:1545892655345574009>",
  bug: "<:tm_bug:1545892654246793317>",
  ghost: "<:tm_ghost:1545892652799762533>",
  steel: "<:tm_steel:1545892651201470535>",
};

type SignatureMovesByType = Record<PokemonType, SignatureMove[]>;

const SIGNATURES_BY_TYPE: SignatureMovesByType = {
  normal: [
    { name: "veevee-volley", legendary: false },
    { name: "barrage", legendary: false },
    { name: "conversion", legendary: false },
    { name: "conversion-2", legendary: false },
    { name: "present", legendary: false },
    { name: "simple-beam", legendary: false },
    { name: "secret-power", legendary: false },
    { name: "revelation-dance", legendary: false },
    { name: "court-change", legendary: false },
    { name: "teatime", legendary: false },
    { name: "confide", legendary: false },
    { name: "population-bomb", legendary: false },
    { name: "doodle", legendary: false },
    { name: "fillet-away", legendary: false },
    { name: "heal-bell", legendary: true },
    { name: "crush-grip", legendary: true },
    { name: "judgment", legendary: true },
    { name: "relic-song", legendary: true },
    { name: "techno-blast", legendary: true },
    { name: "multi-attack", legendary: true },
    { name: "tera-starstorm", legendary: true },
  ],
  fire: [
    { name: "sizzly-slide", legendary: false },
    { name: "eruption", legendary: false },
    { name: "fire-lash", legendary: false },
    { name: "fiery-dance", legendary: false },
    { name: "shell-trap", legendary: false },
    { name: "pyro-ball", legendary: false },
    { name: "torch-song", legendary: false },
    { name: "armor-cannon", legendary: false },
    { name: "bitter-blade", legendary: false },
    { name: "magma-storm", legendary: true },
    { name: "searing-shot", legendary: true },
    { name: "v-create", legendary: true },
    { name: "fusion-flare", legendary: true },
    { name: "blue-flare", legendary: true },
    { name: "mind-blown", legendary: true },
    { name: "burning-bulwark", legendary: true },
  ],
  water: [
    { name: "splishy-splash", legendary: false },
    { name: "bouncy-bubble", legendary: false },
    { name: "sparkling-aria", legendary: false },
    { name: "snipe-shot", legendary: false },
    { name: "fishious-rend", legendary: false },
    { name: "water-shuriken", legendary: false },
    { name: "aqua-step", legendary: false },
    { name: "triple-dive", legendary: false },
    { name: "jet-punch", legendary: false },
    { name: "origin-pulse", legendary: true },
    { name: "steam-eruption", legendary: true },
    { name: "surging-strikes", legendary: true },
    { name: "hydro-steam", legendary: true },
  ],
  electric: [
    { name: "pika-papow", legendary: false },
    { name: "zippy-zap", legendary: false },
    { name: "buzzy-buzz", legendary: false },
    { name: "electrify", legendary: false },
    { name: "overdrive", legendary: false },
    { name: "aura-wheel", legendary: false },
    { name: "bolt-beak", legendary: false },
    { name: "fusion-bolt", legendary: true },
    { name: "bolt-strike", legendary: true },
    { name: "plasma-fists", legendary: true },
    { name: "thunder-cage", legendary: true },
    { name: "electro-drift", legendary: true },
    { name: "thunderclap", legendary: true },
    { name: "rising-voltage", legendary: true },
  ],
  grass: [
    { name: "sappy-seed", legendary: false },
    { name: "chloroblast", legendary: false },
    { name: "snap-trap", legendary: false },
    { name: "forests-curse", legendary: false },
    { name: "solar-blade", legendary: false },
    { name: "trop-kick", legendary: false },
    { name: "drum-beating", legendary: false },
    { name: "grav-apple", legendary: false },
    { name: "apple-acid", legendary: false },
    { name: "flower-trick", legendary: false },
    { name: "spicy-extract", legendary: false },
    { name: "syrup-bomb", legendary: false },
    { name: "seed-flare", legendary: true },
    { name: "jungle-healing", legendary: true },
  ],
  ice: [
    { name: "freezy-frost", legendary: false },
    { name: "ice-hammer", legendary: false },
    { name: "glaciate", legendary: true },
    { name: "ice-burn", legendary: true },
    { name: "freeze-shock", legendary: true },
    { name: "glacial-lance", legendary: true },
  ],
  fighting: [
    { name: "mach-punch", legendary: false },
    { name: "triple-kick", legendary: false },
    { name: "storm-throw", legendary: false },
    { name: "arm-thrust", legendary: false },
    { name: "triple-arrows", legendary: false },
    { name: "octolock", legendary: false },
    { name: "meteor-assault", legendary: false },
    { name: "no-retreat", legendary: false },
    { name: "thunderous-kick", legendary: true },
    { name: "secret-sword", legendary: true },
    { name: "collision-course", legendary: true },
  ],
  poison: [
    { name: "shell-side-arm", legendary: false },
    { name: "toxic-thread", legendary: false },
    { name: "barb-barrage", legendary: false },
    { name: "baneful-bunker", legendary: false },
    { name: "purify", legendary: false },
    { name: "mortal-spin", legendary: false },
    { name: "malignant-chain", legendary: true },
  ],
  ground: [
    { name: "bone-club", legendary: false },
    { name: "bonemerang", legendary: false },
    { name: "shore-up", legendary: false },
    { name: "precipice-blades", legendary: true },
    { name: "lands-wrath", legendary: true },
    { name: "thousand-arrows", legendary: true },
    { name: "thousand-waves", legendary: true },
  ],
  flying: [
    { name: "floaty-fall", legendary: false },
    { name: "chatter", legendary: false },
    { name: "beak-blast", legendary: false },
    { name: "aeroblast", legendary: true },
    { name: "dragon-ascent", legendary: true },
    { name: "oblivion-wing", legendary: true },
  ],
  psychic: [
    { name: "glitzy-glow", legendary: false },
    { name: "kinesis", legendary: false },
    { name: "eerie-spell", legendary: false },
    { name: "psyshield-bash", legendary: false },
    { name: "twin-beam", legendary: false },
    { name: "esper-wing", legendary: false },
    { name: "instruct", legendary: false },
    { name: "magic-powder", legendary: false },
    { name: "lumina-crash", legendary: false },
    { name: "freezing-glare", legendary: true },
    { name: "psystrike", legendary: true },
    { name: "mist-ball", legendary: true },
    { name: "luster-purge", legendary: true },
    { name: "lunar-dance", legendary: true },
    { name: "lunar-blessing", legendary: true },
    { name: "hyperspace-hole", legendary: true },
    { name: "prismatic-laser", legendary: true },
    { name: "photon-geyser", legendary: true },
    { name: "psyblade", legendary: true },
  ],
  bug: [
    { name: "heal-order", legendary: false },
    { name: "defend-order", legendary: false },
    { name: "attack-order", legendary: false },
    { name: "pollen-puff", legendary: false },
    { name: "silk-trap", legendary: false },
  ],
  rock: [
    { name: "accelerock", legendary: false },
    { name: "tar-shot", legendary: false },
    { name: "stone-axe", legendary: false },
    { name: "diamond-storm", legendary: true },
    { name: "mighty-cleave", legendary: true },
  ],
  ghost: [
    { name: "shadow-bone", legendary: false },
    { name: "infernal-parade", legendary: false },
    { name: "trick-or-treat", legendary: false },
    { name: "spirit-shackle", legendary: false },
    { name: "rage-fist", legendary: false },
    { name: "shadow-force", legendary: true },
    { name: "moongeist-beam", legendary: true },
    { name: "spectral-thief", legendary: true },
    { name: "astral-barrage", legendary: true },
  ],
  dragon: [
    { name: "clanging-scales", legendary: false },
    { name: "clangorous-soul", legendary: false },
    { name: "dragon-darts", legendary: false },
    { name: "order-up", legendary: false },
    { name: "glaive-rush", legendary: false },
    { name: "fickle-beam", legendary: false },
    { name: "roar-of-time", legendary: true },
    { name: "spacial-rend", legendary: true },
    { name: "core-enforcer", legendary: true },
    { name: "dynamax-cannon", legendary: true },
    { name: "eternabeam", legendary: true },
    { name: "dragon-energy", legendary: true },
  ],
  dark: [
    { name: "baddy-bad", legendary: false },
    { name: "ceaseless-edge", legendary: false },
    { name: "parting-shot", legendary: false },
    { name: "topsy-turvy", legendary: false },
    { name: "false-surrender", legendary: false },
    { name: "obstruct", legendary: false },
    { name: "kowtow-cleave", legendary: false },
    { name: "fiery-wrath", legendary: true },
    { name: "dark-void", legendary: true },
    { name: "hyperspace-fury", legendary: true },
    { name: "wicked-blow", legendary: true },
    { name: "ruination", legendary: true },
  ],
  steel: [
    { name: "gear-grind", legendary: false },
    { name: "kings-shield", legendary: false },
    { name: "anchor-shot", legendary: false },
    { name: "gigaton-hammer", legendary: false },
    { name: "spin-out", legendary: false },
    { name: "make-it-rain", legendary: false },
    { name: "doom-desire", legendary: true },
    { name: "sunsteel-strike", legendary: true },
    { name: "double-iron-bash", legendary: true },
    { name: "behemoth-blade", legendary: true },
    { name: "behemoth-bash", legendary: true },
    { name: "tachyon-cutter", legendary: true },
  ],
  fairy: [
    { name: "sparkly-swirl", legendary: false },
    { name: "flower-shield", legendary: false },
    { name: "crafty-shield", legendary: false },
    { name: "fairy-lock", legendary: false },
    { name: "floral-healing", legendary: false },
    { name: "spirit-break", legendary: false },
    { name: "decorate", legendary: false },
    { name: "light-of-ruin", legendary: true },
    { name: "geomancy", legendary: true },
    { name: "fleur-cannon", legendary: true },
  ],
};

const SIGNATURES = new Set([
  "pika-papow",
  "zippy-zap",
  "splishy-splash",
  "floaty-fall",
  "veevee-volley",
  "sizzly-slide",
  "buzzy-buzz",
  "bouncy-bubble",
  "glitzy-glow",
  "baddy-bad",
  "sappy-seed",
  "freezy-frost",
  "sparkly-swirl",
  "kinesis",
  "shell-side-arm",
  "chloroblast",
  "barrage",
  "bone-club",
  "bonemerang",
  "shadow-bone",
  "mach-punch",
  "conversion",
  "conversion-2",
  "infernal-parade",
  "toxic-thread",
  "eerie-spell",
  "barb-barrage",
  "present",
  "psyshield-bash",
  "twin-beam",
  "triple-kick",
  "eruption",
  "heal-order",
  "defend-order",
  "attack-order",
  "flower-shield",
  "chatter",
  "ceaseless-edge",
  "simple-beam",
  "secret-power",
  "storm-throw",
  "crafty-shield",
  "gear-grind",
  "snap-trap",
  "esper-wing",
  "fire-lash",
  "fiery-dance",
  "parting-shot",
  "arm-thrust",
  "kings-shield",
  "topsy-turvy",
  "electrify",
  "fairy-lock",
  "forests-curse",
  "trick-or-treat",
  "spirit-shackle",
  "triple-arrows",
  "sparkling-aria",
  "beak-blast",
  "ice-hammer",
  "revelation-dance",
  "pollen-puff",
  "accelerock",
  "baneful-bunker",
  "solar-blade",
  "trop-kick",
  "floral-healing",
  "instruct",
  "shore-up",
  "purify",
  "shell-trap",
  "anchor-shot",
  "clanging-scales",
  "clangorous-soul",
  "drum-beating",
  "pyro-ball",
  "court-change",
  "snipe-shot",
  "tar-shot",
  "grav-apple",
  "apple-acid",
  "overdrive",
  "octolock",
  "teatime",
  "magic-powder",
  "confide",
  "false-surrender",
  "spirit-break",
  "obstruct",
  "meteor-assault",
  "decorate",
  "no-retreat",
  "aura-wheel",
  "bolt-beak",
  "fishious-rend",
  "dragon-darts",
  "water-shuriken",
  "stone-axe",
  "flower-trick",
  "torch-song",
  "aqua-step",
  "silk-trap",
  "population-bomb",
  "armor-cannon",
  "bitter-blade",
  "doodle",
  "spicy-extract",
  "lumina-crash",
  "gigaton-hammer",
  "triple-dive",
  "jet-punch",
  "spin-out",
  "mortal-spin",
  "fillet-away",
  "order-up",
  "rage-fist",
  "kowtow-cleave",
  "glaive-rush",
  "make-it-rain",
  "syrup-bomb",
  "fickle-beam",
]);

const LEGENDARYSIGNATURES = new Set([
  "freezing-glare",
  "thunderous-kick",
  "fiery-wrath",
  "psystrike",
  "aeroblast",
  "heal-bell",
  "mist-ball",
  "luster-purge",
  "origin-pulse",
  "precipice-blades",
  "dragon-ascent",
  "doom-desire",
  "roar-of-time",
  "spacial-rend",
  "shadow-force",
  "magma-storm",
  "crush-grip",
  "lunar-dance",
  "lunar-blessing",
  "dark-void",
  "seed-flare",
  "judgment",
  "searing-shot",
  "v-create",
  "fusion-flare",
  "blue-flare",
  "fusion-bolt",
  "bolt-strike",
  "glaciate",
  "ice-burn",
  "freeze-shock",
  "secret-sword",
  "relic-song",
  "techno-blast",
  "light-of-ruin",
  "geomancy",
  "oblivion-wing",
  "lands-wrath",
  "thousand-arrows",
  "thousand-waves",
  "core-enforcer",
  "diamond-storm",
  "hyperspace-hole",
  "hyperspace-fury",
  "steam-eruption",
  "multi-attack",
  "sunsteel-strike",
  "moongeist-beam",
  "prismatic-laser",
  "photon-geyser",
  "fleur-cannon",
  "spectral-thief",
  "mind-blown",
  "plasma-fists",
  "double-iron-bash",
  "behemoth-blade",
  "behemoth-bash",
  "dynamax-cannon",
  "eternabeam",
  "wicked-blow",
  "surging-strikes",
  "jungle-healing",
  "thunder-cage",
  "dragon-energy",
  "glacial-lance",
  "astral-barrage",
  "ruination",
  "collision-course",
  "electro-drift",
  "hydro-steam",
  "psyblade",
  "burning-bulwark",
  "thunderclap",
  "rising-voltage",
  "mighty-cleave",
  "tachyon-cutter",
  "tera-starstorm",
  "ivy-cudgel",
  "malignant-chain",
]);
const BANNED = new Set(["sketch"]);

const Z_SIGNATURES = new Set([
  "catastropika",
  "10-000-000-volt-thunderbolt",
  "stoked-sparksurfer",
  "extreme-evoboost",
  "pulverizing-pancake",
  "genesis-supernova",
  "sinister-arrow-raid",
  "malicious-moonsault",
  "oceanic-operetta",
  "splintered-stormshards",
  "lets-snuggle-forever",
  "clangorous-soulblaze",
  "guardian-of-alola",
  "searing-sunraze-smash",
  "menacing-moonraze-maelstrom",
  "light-that-burns-the-sky",
  "soul-stealing-7-star-strike",
]);

const Z_REGULARS = new Set([
  "breakneck-blitz",
  "all-out-pummeling",
  "supersonic-skystrike",
  "acid-downpour",
  "tectonic-rage",
  "continental-crush",
  "savage-spin-out",
  "never-ending-nightmare",
  "corkscrew-crash",
  "inferno-overdrive",
  "hydro-vortex",
  "bloom-doom",
  "gigavolt-havoc",
  "shattered-psyche",
  "subzero-slammer",
  "devastating-drake",
  "black-hole-eclipse",
  "twinkle-tackle",
]);

export async function getRandLearnableMove(pokemon: Pokemon) {
  let random = Math.floor(Math.random() * pokemon.moves.length);
  return await P.getMoveByName(pokemon.moves[random]!.move.name);
}

export async function getRandMove() {
  const moves = await P.getResource(
    "https://pokeapi.co/api/v2/move/?offset=0&limit=-1",
  );
  let random = Math.floor(Math.random() * 918);
  return await P.getMoveByName(moves.results[random].name);
}

function nonSignatureLegalCheck(name: string) {
  if (
    LEGENDARYSIGNATURES.has(name) ||
    SIGNATURES.has(name) ||
    isZMove(name) ||
    isGMax(name) ||
    BANNED.has(name)
  )
    return false;
  return true;
}

export function getPrice(move: Move, moveData: characterHelper.tmData) {
  if (moveData.legendary) {
    return 50000;
  }
  var basePrice;
  if (move.damage_class.name == "status") {
    basePrice = 5000;
  } else {
    basePrice =
      (move.power ?? 50) * (move.meta?.max_hits ?? 1) * (move.accuracy ?? 100);
    if (move.priority > 0) {
      basePrice += 1000;
    }
  }

  if (!moveData.learnedMoves) {
    basePrice *= 1.5;
  }
  if (!moveData.typeMatch) {
    basePrice *= 1.5;
  }
  if (moveData.signature) {
    basePrice *= 2;
  }
  return basePrice;
}

export async function getStoreEntry(
  id: number,
  moveData: characterHelper.tmData,
) {
  const move = await P.getMoveByName(id);
  var emoji = ``;
  if (moveData.legendary) {
    emoji = `⭐ `;
  } else if (moveData.signature) {
    emoji = `<:shiny:1539739147001012234> `;
  }
  return `${emoji}${tmEmojis[move.type.name as PokemonType]} **TM ${move.id}: ${move.names.find((move) => move.language.name === "en")!.name}** // ₽${getPrice(move, moveData)}
-# > ${move.flavor_text_entries.find((move) => move.language.name === "en")?.flavor_text.replaceAll("\n", " ")}`;
}

export async function getStoreFront(buyerid: string, charaName: string) {
  const row = new ActionRowBuilder();
  const menu = new StringSelectMenuBuilder().setCustomId(`buy:tm:${buyerid}`);
  var character = await characterHelper.getCharacter(buyerid, charaName);
  const partner = await P.getPokemonByName(character.partner.species);

  const lastShopped = new Date(character.lastShopped ?? 2);
  const today = new Date();
  var shopSet = character.shoppingArray;
  //if it's still the same day as generated
  if (
    lastShopped.getDate() != today.getDate() ||
    lastShopped.getMonth() != today.getMonth()
  ) {
    const users = await characterHelper.getUsers();
    shopSet = await rerollEntries(partner);
    users[buyerid]!.characters[charaName]!.lastShopped = today;
    users[buyerid]!.characters[charaName]!.shoppingArray = shopSet;
    await characterHelper.saveUsersExternal(users);
  }
  const entries: string[] = [];

  for (const id of shopSet!) {
    const move = await P.getMoveByName(id.id);
    entries.push(await getStoreEntry(id.id, id));

    const price = getPrice(move, id);
    if (price <= character.balance) {
      menu.addOptions({
        label: `TM ${move.id}: ${move.names.find((move) => move.language.name === "en")!.name} | ₽${price}`,
        value: `${character.name}:${move.name}:${move.id}:${price}`,
        emoji: tmEmojis[move.type.name as PokemonType],
      });
    }
  }

  if (menu.options.length > 0) {
    row.addComponents(menu);
  }
  const embed = new EmbedBuilder().setColor("#777d81");
  embed.setDescription(entries.join("\n") + " ");
  embed.setImage(
    "https://www.brycekho.com/uploads/2/5/0/8/25083559/11x17-psyduck-shiny.jpg",
  );
  embed.setTitle(
    `${charaName}'s TM Shop! | ${months[today.getMonth()]} ${today.getDate()}`,
  );
  embed.setFooter({
    text: `${charaName}'s balance: ₽${character.balance} | banner by brycekhodraws on twitter`,
  });

  return {
    embeds: [embed],
    components: row.components.length > 0 ? [row] : [],
  };
}

export async function rerollEntries(pokemon: Pokemon) {
  // 2 that the pokemon can learn naturally
  const rolledEntries = [];
  var random = await getRandLearnableMove(pokemon);
  rolledEntries.push(random.id);

  var random2;
  while (!random2) {
    let rolled = await getRandLearnableMove(pokemon);
    if (
      !rolledEntries.some((value) => {
        return value == rolled.id;
      })
    ) {
      random2 = rolled;
      rolledEntries.push(random2.id);
    }
  }

  // 2 that is the pokemon's type (nonsignature, can be any)
  const type = await P.getTypeByName(pokemon.types[0]!.type.name);
  const type2 = pokemon.types[1]
    ? await P.getTypeByName(pokemon.types[1]!.type.name)
    : type;

  var typeMove1;
  var typeMove2;
  while (!typeMove1) {
    let rolled = await P.getMoveByName(
      type.moves[Math.floor(Math.random() * type.moves.length)]!.name,
    );
    if (
      nonSignatureLegalCheck(rolled.name) &&
      !rolledEntries.some((value) => {
        return value == rolled.id;
      })
    ) {
      typeMove1 = rolled;
      rolledEntries.push(typeMove1.id);
    }
  }

  while (!typeMove2) {
    let rolled = await P.getMoveByName(
      type.moves[Math.floor(Math.random() * type.moves.length)]!.name,
    );
    if (
      nonSignatureLegalCheck(rolled.name) &&
      !rolledEntries.some((value) => {
        return value == rolled.id;
      })
    ) {
      typeMove2 = rolled;
      rolledEntries.push(typeMove2.id);
    }
  }

  var gamble;
  while (!gamble) {
    let rolled = await rareGambleTM(type, type2);
    if (
      !rolledEntries.some((value) => {
        return value == rolled.id;
      })
    ) {
      gamble = rolled;
      rolledEntries.push(gamble.id);
    }
  }

  // 1 is rand ANY move (nonsignature), 20% chance to be a signature (must be same type?), 3% chance to be a legendary's signature
  return [
    getTMData(pokemon, random),
    getTMData(pokemon, random2),
    getTMData(pokemon, typeMove1),
    getTMData(pokemon, typeMove2),
    getTMData(pokemon, gamble!),
  ];
}

export async function rareGambleTM(type1: Type, type2: Type) {
  const random = Math.floor(Math.random() * 100);
  var move;

  if (random >= 80) {
    let isType1 = Math.floor(Math.random() * 2) == 0;

    const type1Filter = SIGNATURES_BY_TYPE[type1.name as PokemonType].filter(
      (move) => move.legendary == false,
    );
    const type2Filter = SIGNATURES_BY_TYPE[type2.name as PokemonType].filter(
      (move) => move.legendary == false,
    );

    let random = Math.floor(
      Math.random() * (type1 ? type1Filter.length : type2Filter.length),
    );

    const movename = isType1
      ? type1Filter[random]!.name
      : type2Filter[random]!.name;
    move = await P.getMoveByName(movename);
  } else if (random >= 75) {
    let isType1 = Math.floor(Math.random() * 2) == 0;

    const type1Filter = SIGNATURES_BY_TYPE[type1.name as PokemonType].filter(
      (move) => move.legendary == true,
    );
    const type2Filter = SIGNATURES_BY_TYPE[type2.name as PokemonType].filter(
      (move) => move.legendary == true,
    );

    let random = Math.floor(
      Math.random() * (type1 ? type1Filter.length : type2Filter.length),
    );

    const movename = isType1
      ? type1Filter[random]!.name
      : type2Filter[random]!.name;
    move = await P.getMoveByName(movename);
  } else {
    move = getRandMove();
    while (!move) {
      let random = await getRandMove();
      if (nonSignatureLegalCheck(random.name)) {
        move = random;
      }
    }
  }
  return move;
}

export function getTMData(
  pokemon: Pokemon,
  move: Move,
): characterHelper.tmData {
  return {
    id: move.id,
    legendary: LEGENDARYSIGNATURES.has(move.name),
    signature: SIGNATURES.has(move.name),
    learnedMoves: pokemon.moves.some(
      (learnset) => learnset.move.name === move.name,
    ),
    typeMatch:
      pokemon.types[0]!.type.name === move.type.name ||
      pokemon.types[1]?.type.name === move.type.name,
  };
}

export function getAllMoveNames() {
  console.log(moves);
}

export function isZMove(name: string) {
  return (
    name.endsWith("--special") ||
    name.endsWith("--physical") ||
    Z_SIGNATURES.has(name) ||
    Z_REGULARS.has(name)
  );
}

export function isGMax(name: string) {
  return name.startsWith("g-max") || name.startsWith("max");
}
