import Pokedex, { Pokemon, Type } from "pokedex-promise-v2";
import { EmbedBuilder, ColorResolvable } from "discord.js";

const P = new Pokedex();

interface ColorData {
  hexcode: ColorResolvable;
  bannerLink: string;
  bannerCreds: string;
}

const PARADOX_POKEMON = new Set([
  // Scarlet
  "great-tusk",
  "scream-tail",
  "brute-bonnet",
  "flutter-mane",
  "slither-wing",
  "sandy-shocks",
  "roaring-moon",

  // Violet
  "iron-treads",
  "iron-bundle",
  "iron-hands",
  "iron-jugulis",
  "iron-moth",
  "iron-thorns",
  "iron-valiant",

  // DLC
  "walking-wake",
  "gouging-fire",
  "raging-bolt",
  "iron-leaves",
  "iron-boulder",
  "iron-crown",
]);

const ULTRA_BEASTS = new Set([
  "nihilego",
  "buzzwole",
  "pheromosa",
  "xurkitree",
  "celesteela",
  "kartana",
  "guzzlord",
  "poipole",
  "naganadel",
  "stakataka",
  "blacephalon",
]);

export const colors: Record<string, ColorData> = {
  red: {
    hexcode: "#ce1b1b",
    bannerLink:
      "https://i.pinimg.com/originals/a6/17/32/a61732f43791d44d5d1ca18057d59574.gif",
    bannerCreds: "banner from an official game: the last blade",
  },

  blue: {
    hexcode: "#3473fa",
    bannerLink: "https://i.redd.it/dt799bhjhhoc1.gif",
    bannerCreds: "banner by @anasabdin on tumblr",
  },

  yellow: {
    hexcode: "#fadb2c",
    bannerLink:
      "https://i.pinimg.com/originals/b6/1c/2a/b61c2abdd2e1abd354e6b0692cce6e37.gif",
    bannerCreds: "banner by @anasabdin on tumblr",
  },

  green: {
    hexcode: "#15c048",
    bannerLink:
      "https://i.pinimg.com/originals/0a/12/e1/0a12e130650543cf5b165a008d1604e3.gif",
    bannerCreds: "banner by @minimoss on tumblr",
  },

  black: {
    hexcode: "#221e1e",
    bannerLink:
      "https://i.pinimg.com/originals/c1/fc/9d/c1fc9d7f6ae08d56f2b84e81799790a5.gif",
    bannerCreds: "banner by @waneella on tumblr",
  },

  brown: {
    hexcode: "#ad7250",
    bannerLink:
      "https://i.pinimg.com/originals/cf/65/a7/cf65a7b41594a1794d07e1f2041f4b6e.gif",
    bannerCreds: "banner by @waneella on tumblr",
  },

  purple: {
    hexcode: "#801d8d",
    bannerLink:
      "https://i.pinimg.com/originals/b9/01/85/b9018579aebd5c161b0eac79ca04f17a.gif",
    bannerCreds: "banner by @pixeldanc3r on twitter",
  },

  gray: {
    hexcode: "#746f6f",
    bannerLink:
      "https://i.pinimg.com/originals/cc/85/30/cc8530a1418e2d94c35590e6543a3a22.gif",
    bannerCreds: "banner by @waneella on tumblr",
  },

  white: {
    hexcode: "#eee6e6",
    bannerLink:
      "https://i.pinimg.com/originals/80/6e/de/806ede5583f088c6bdb788bf867f8064.gif",
    bannerCreds: "banner by @lennsan on tumblr",
  },

  pink: {
    hexcode: "#db7a89",
    bannerLink:
      "https://i.pinimg.com/originals/eb/cc/2b/ebcc2bbe06889c7b104786ea1a189622.gif",
    bannerCreds: "banner by @waneella on tumblr",
  },
};

export async function findPokemon(name: string) {
  try {
    return await P.getPokemonByName(name.toLowerCase());
  } catch {
    return undefined;
  }
}

export async function getEvolutionPath(dest: string) {
  if (dest === "basculin-white-striped") return ["basculin-white-striped"];
  if (dest === "basculegion-female")
    return ["basculin-white-striped", "basculegion-female"];
  if (dest === "basculegion-male")
    return ["basculin-white-striped", "basculegion-male"];
  if (dest === "frillish-male") return ["frillish-male"];
  if (dest === "jellicent-male") return ["frillish-male", "jellicent-male"];
  if (dest === "wormadam-plant") return ["burmy", "wormadam-plant"];
  if (dest === "wormadam-sandy") return ["burmy", "wormadam-sandy"];
  if (dest === "wormadam-trash") return ["burmy", "wormadam-trash"];
  if (dest === "palafin-zero") return ["finizen", "palafin-zero"];
  if (dest === "palafin-hero") return ["finizen", "palafin-hero"];
  if (dest === "dudunsparce-two-segment") return ["dunsparce", "dudunsparce-two-segment"];
  if (dest === "dudunsparce-three-segment") return ["dunsparce", "dudunsparce-three-segment"];

  try {
    const pokemon = await P.getPokemonByName(dest.toLowerCase());
    const pokemonSpecies = await P.getResource(pokemon.species.url);
    const evoChain = await P.getResource(pokemonSpecies.evolution_chain.url);

    const paths = await getEvolutionPathHelper(evoChain.chain, pokemon.name);
    if (paths) return paths;

    return [pokemon.name];
  } catch {
    return [];
  }
}

export async function getDirectEvolutions(pokemon: Pokemon) {
  switch (pokemon.name) {
    case "basculin-white-striped":
      return ["basculegion-female", "basculegion-male"];
    case "frillish-male":
      return ["jellicent-male"];
    case "burmy":
      return ["wormadam-plant", "wormadam-sandy", "wormadam-trash"];
    case "finizen":
      return ["palafin-zero", "palafin-hero"];
    case "dunsparce":
      return ["dudunsparce-two-segment", "dudunsparce-three-segment"];
  }

  try {
    const pokemonSpecies = await P.getResource(pokemon.species.url);
    const evoChain = await P.getResource(pokemonSpecies.evolution_chain.url);

    const evolutionChain = getCurrentEvoChainLink(evoChain.chain, pokemonSpecies.name);
    const evolutions = getEvolutionsHelper(evolutionChain, pokemon.name);

    return evolutions;
  } catch {
    return [];
  }
}

function getCurrentEvoChainLink(chainLink: any, current: string): any | undefined {

  if (chainLink.species.name == current) {
    return chainLink;
  }


  for (const evolution of chainLink.evolves_to) {
    // iterates over each evolution (regional forms included)
    for (const detail of evolution.evolution_details) {
      // goes over the detail of each evolution (which form is required? which form is base?)
      //checks if it evolves into a regional form
      //var evolvedForm = detail.evolved_form?.name ?? evolution.species.name;
      //check if the base form requires a regional form
      var baseForm = detail.base_form?.name ?? chainLink.species.name;

      const evoChain = getCurrentEvoChainLink(evolution, current);
      if (evoChain) {
        return evoChain;
      }
    }
  }

}

function getEvolutionsHelper(
  chainLink: any,
  current: string,
): Set<string> {

  const evolutions = new Set<string>();
  //each evolution that they can get
  for (const evolution of chainLink.evolves_to) {
    // iterates over each evolution (regional forms included)
    for (const detail of evolution.evolution_details) {
      // goes over the detail of each evolution (which form is required? which form is base?)
      //checks if it evolves into a regional form
      var evolvedForm = detail.evolved_form?.name ?? evolution.species.name;
      //check if the base form requires a regional form
      var baseForm = detail.base_form?.name ?? chainLink.species.name;

      console.log(evolvedForm);
      if (baseForm == current) {
        evolutions.add(evolvedForm);
      }
    }
  }

  return evolutions;
}

function getEvolutionPathHelper(
  chainLink: any,
  target: string,
  path: string[] = [],
  currentName?: string,
): string[] | null {
  if (currentName === target) {
    return [...path, currentName];
  }

  //each evolution that they can get
  for (const evolution of chainLink.evolves_to) {
    // iterates over each evolution (regional forms included)
    for (const detail of evolution.evolution_details) {
      // goes over the detail of each evolution (which form is required? which form is base?)
      //checks if it evolves into a regional form
      var evolvedForm = detail.evolved_form?.name ?? evolution.species.name;
      //check if the base form requires a regional form
      var baseForm = detail.base_form?.name ?? chainLink.species.name;

      var result;
      result = getEvolutionPathHelper(
        evolution,
        target,
        [...path, baseForm],
        evolvedForm,
      );
      if (result) {
        return result;
      }
    }
  }

  return null;
}

export async function findBaseMon(pokemon: any) {
  const evoTree = await getEvolutionPath(pokemon.name);
  return await P.getPokemonByName(evoTree[0]!);
}

export async function findRandomMon() {
  let random = Math.floor(Math.random() * 1352);

  // Include mega versions
  if (random > 1025) {
    random += 10000;
    random -= 1025;
  }

  return await P.getPokemonByName(`${random}`);
}

export async function getRandomPokemonByType(type: String): Promise<Pokemon> {
  const typedMons = await P.getResource(
    `https://pokeapi.co/api/v2/type/${type.toLowerCase()}`,
  );

  var valid = false;
  var pokemon;
  while (valid === false) {
    var random = Math.floor(Math.random() * typedMons.pokemon.length);
    pokemon = await P.getResource(typedMons.pokemon[random].pokemon.url);
    if (await isLegendOrMyth(pokemon.name) === false) {
      valid = true;
    }
  }

  return pokemon;
}

export async function getRandDexEntry(pokemonName: string): Promise<string> {
  const pokemon = await P.getPokemonByName(pokemonName);

  const species = await P.getResource(pokemon.species.url);

  const entries = species.flavor_text_entries.filter(
    (entry: any) => entry.language.name === "en",
  );

  const random = Math.floor(Math.random() * entries.length);

  return entries[random].flavor_text.replace(/\f/g, " ").replace(/\n/g, " ");
}

export async function getGenera(pokemonName: string): Promise<string> {
  const pokemon = await P.getPokemonByName(pokemonName);
  const species = await P.getResource(pokemon.species.url);
  const entry = species.genera.find((item: any) => item.language.name === "en");

  return entry?.genus ?? "Pokémon";
}

export async function isLegendOrMyth(pokemonName: string): Promise<boolean> {
  const name = pokemonName.toLowerCase();

  if (pokemonName.includes("-mega") || pokemonName.includes("-gmax") || pokemonName.includes("-totem") || pokemonName.includes("-eternal") || pokemonName.includes("-bloodmoon") || pokemonName.includes("-starter")) {
    return true;
  }
  if (PARADOX_POKEMON.has(name) || ULTRA_BEASTS.has(name)) {
    return true;
  }

  const pokemon = await P.getPokemonByName(pokemonName);
  const species = await P.getResource(pokemon.species.url);
  return species.is_legendary || species.is_mythical;
}

export async function pokeEmbedCreate(pokemon: any): Promise<EmbedBuilder> {
  const dexEntry = await getRandDexEntry(pokemon.name);
  const species = await P.getResource(pokemon.species.url);
  const color = colors[species.color.name]!;

  const type1 = displayName(pokemon.types[0].type.name);
  const type2 = pokemon.types[1]
    ? `/${displayName(pokemon.types[1].type.name)}`
    : ``;

  const embed = new EmbedBuilder()
    .setTitle(
      `${displayName(pokemon.name)} | The ${await getGenera(pokemon.name)}`,
    )
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    )
    .setColor(color.hexcode)
    .setDescription(
      `**Typing** | ${type1}${type2}
      
      ${dexEntry}`,
    )
    .setImage(color.bannerLink)
    .addFields(
      {
        name: `Average Height`,
        value: `${(pokemon.height * 0.1).toFixed(1)} m | ${cmToFeetConversion(pokemon.height * 10)}`,
        inline: true,
      },
      {
        name: `Average Weight`,
        value: `${(pokemon.weight * 0.1).toFixed(1)} kg | ${kgToPounds(pokemon.weight * 0.1)} lbs`,
        inline: true,
      },
    )
    .setFooter({ text: `${color.bannerCreds}` });

  return embed;
}

export function cmToFeetConversion(cm: number) {
  var realFeet = cm / 30.48;
  var feet = Math.floor(realFeet);
  var inches = ((realFeet - feet) * 12).toFixed(0);
  return feet + "'" + inches + '"';
}
export function kgToPounds(kg: number) {
  return (kg * 2.20452262).toFixed(1);
}

export function displayName(pokemonName: string) {
  var form = "";
  var name = pokemonName.toLowerCase();
  if (name.includes("-paldea")) {
    form = "Paldean ";
    name = name.replace("-paldea", "");
  }

  if (name.includes("-galar")) {
    form = "Galarian ";
    name = name.replace("-galar", "");
  }

  if (name.includes("-hisui")) {
    form = "Hisuian ";
    name = name.replace("-hisui", "");
  }
  if (name.includes("-alola")) {
    form = "Alolan ";
    name = name.replace("-alola", "");
  }

  if (name.includes("-mega")) {
    form = "Mega ";
    name = name.replace("-mega", "");
  }

  if (name.includes("-gmax")) {
    form = "Gigantamax ";
    name = name.replace("-gmax", "");
  }

  switch (name) {
    case "mime-jr":
      name = "Mime Jr.";
      break;
    case "mr-mime":
      name = "Mr. Mime";
      break;
    case "mr-rime":
      name = "Mr. Rime";
      break;
    case "porygon-z":
      name = "Porygon-Z";
      break;
    case "ho-oh":
      name = "Ho-oh";
      break;
    case "type-null":
      name = "Type: Null";
      break;
    case "wo-chien":
      name = "Wo-Chien";
      break;
    case "chi-yu":
      name = "Chi-Yu";
      break;
    case "chien-pao":
      name = "Chien-Pao";
      break;
    case "ting-lu":
      name = "Ting-Lu";
      break;
    case "sirfetchd":
      name = "Sirfetch'd";
      break;
    case "farfetchd":
      name = "Farfetch'd";
      break;
    case "jangmo-o":
      name = "Jangmo-o";
      break;
    case "hakamo-o":
      name = "Hakamo-o";
      break;
    case "kommo-o":
      name = "Kommo-o";
      break;
    case "flabebe":
      name = "Flabébé";
      break;
    default:
      name = name
        .replaceAll("-", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      break;
  }
  return form + name;
}

export async function getSprite(
  pokemonName: string,
  pokemonGender: string | undefined,
  shiny: boolean,
) {
  const pokemon = await P.getPokemonByName(pokemonName.toLowerCase());
  const sprites = pokemon.sprites;

  // if it is female
  if (pokemonGender && pokemonGender === "Female") {
    if (shiny === true) {
      return sprites.front_shiny_female ?? sprites.front_shiny;
    } else {
      return sprites.front_female ?? sprites.front_default;
    }
  }
  if (shiny === true) {
    return sprites.front_shiny;
  }
  return sprites.front_default;
}

export function getSize(sizeMult: number) {
  if (sizeMult < 0.85) return "(XS)";
  if (sizeMult < 0.95) return "(S)";
  if (sizeMult < 1.05) return "(M)";
  if (sizeMult < 1.15) return "(L)";
  if (sizeMult <= 1.25) return "(XL)";
  if (sizeMult <= 2) return "<:alpha:1539739148586455162>";
}

export async function getPossibleGenders(pokemonName: string) {
  const pokemon = await findPokemon(pokemonName.toLowerCase());
  const pokemonSpecies = await P.getResource(pokemon!.species.url);
  switch (pokemonSpecies.gender_rate) {
    case -1:
      return [{ value: "Genderless", name: "Genderless" }]; //["Genderless"];
    case 0:
      return [{ value: "Male", name: "Male" }];
    case 8:
      return [{ value: "Female", name: "Female" }];
    default:
      return [
        { value: "Male", name: "Male" },
        { value: "Female", name: "Female" },
      ];
  }
}

//returns an ability at a specific slot
export function getAbilityName(pokemonObj: Pokemon, slot: number) {
  const ability = pokemonObj.abilities.find((a) => a.slot == slot);
  if (ability) {
    return displayName(ability.ability.name);
  }

  const ability2 = pokemonObj.abilities.find((a) => a.slot == slot - 1);
  if (ability2) {
    return displayName(ability2.ability.name);
  }

  const ability3 = pokemonObj.abilities.find((a) => a.slot == slot - 3);
  if (ability3) {
    return displayName(ability3.ability.name);
  }
}

export async function getPossibleAbilities(
  pokemonName: string,
  pokemonDest: string,
) {
  const pokemon = await findPokemon(pokemonName.toLowerCase());
  const destMon = await findPokemon(pokemonDest.toLowerCase());
  var sameMon = pokemonName === pokemonDest;

  return [
    {
      value: "1",
      name: `Slot 1 | ${getAbilityName(pokemon!, 1)}${!sameMon ? ` (${getAbilityName(destMon!, 1)})` : ``}`,
    },
    {
      value: "2",
      name: `Slot 2 | ${getAbilityName(pokemon!, 2)}${!sameMon ? ` (${getAbilityName(destMon!, 2)})` : ``}`,
    },
    {
      value: "3",
      name: `Slot HA | ${getAbilityName(pokemon!, 3)}${!sameMon ? ` (${getAbilityName(destMon!, 3)})` : ``}`,
    },
  ];
}

export async function getColor(pokemon: any): Promise<ColorData> {
  const species = await P.getResource(pokemon.species.url);
  return colors[species.color.name]!;
}