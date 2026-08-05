import Pokedex from "pokedex-promise-v2";
import { EmbedBuilder, ColorResolvable } from "discord.js";

const P = new Pokedex();

interface ColorData {
  hexcode: ColorResolvable;
  bannerLink: string;
  bannerCreds: string;
}

const colors: Record<string, ColorData> = {
  red: {
    hexcode: "#ce1b1b",
    bannerLink:
      "https://i.pinimg.com/originals/a6/17/32/a61732f43791d44d5d1ca18057d59574.gif",
    bannerCreds: "",
  },

  blue: {
    hexcode: "#3473fa",
    bannerLink: "https://i.redd.it/dt799bhjhhoc1.gif",
    bannerCreds: "",
  },

  yellow: {
    hexcode: "#fadb2c",
    bannerLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJUTCgh7DOFcRBLXGvGAMPu3QRf82B8TCToexws_K6FA&s=10",
    bannerCreds: "",
  },

  green: {
    hexcode: "#15c048",
    bannerLink:
      "https://i.pinimg.com/originals/0a/12/e1/0a12e130650543cf5b165a008d1604e3.gif",
    bannerCreds: "",
  },

  black: {
    hexcode: "#221e1e",
    bannerLink:
      "https://64.media.tumblr.com/fd970fa64ea36db438022444d9e1ba43/tumblr_p4x6ed3lQP1u7gnm9o1_500.gif",
    bannerCreds: "",
  },

  brown: {
    hexcode: "#ad7250",
    bannerLink:
      "https://i.pinimg.com/originals/cf/65/a7/cf65a7b41594a1794d07e1f2041f4b6e.gif",
    bannerCreds: "",
  },

  purple: {
    hexcode: "#801d8d",
    bannerLink:
      "https://i.pinimg.com/originals/b9/01/85/b9018579aebd5c161b0eac79ca04f17a.gif",
    bannerCreds: "",
  },

  gray: {
    hexcode: "#746f6f",
    bannerLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP-CfFBubLCM6YsrtjRSiRn7GNNpqCpojl-keCVBwqOg&s=10",
    bannerCreds: "",
  },

  white: {
    hexcode: "#eee6e6",
    bannerLink:
      "https://i.pinimg.com/originals/20/e9/22/20e92227c9b739044e377b3567cfdac0.gif",
    bannerCreds: "",
  },

  pink: {
    hexcode: "#db7a89",
    bannerLink:
      "https://i.pinimg.com/originals/a4/94/3d/a4943d26744e1f14630dd9ddb4f499d8.gif",
    bannerCreds: "",
  },
};

export async function findPokemon(name: string) {
  try {
    return await P.getPokemonByName(name);
  } catch {
    return undefined;
  }
}

export async function getEvolutionPath(dest: string){
  if (dest === "basculin-white-striped") return ["basculin-white-striped"];
  if (dest === "basculegion-female")
    return ["basculin-white-striped", "basculegion-female"];
  if (dest === "basculegion-male")
    return ["basculin-white-striped", "basculegion-male"];
  if (dest === "frillish-male") return ["frillish-male"];
  if (dest === "jellicent-male") return ["frillish-male", "jellicent-male"];

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

export async function getRandDexEntry(pokemonName: string): Promise<string> {
  const pokemon = await P.getPokemonByName(pokemonName);

  const species = await P.getResource(pokemon.species.url);

  const entries = species.flavor_text_entries.filter(
    (entry) => entry.language.name === "en",
  );

  const random = Math.floor(Math.random() * entries.length);

  return entries[random].flavor_text.replace(/\f/g, " ").replace(/\n/g, " ");
}

export async function getGenera(pokemonName: string): Promise<string> {
  const pokemon = await P.getPokemonByName(pokemonName);
  const species = await P.getResource(pokemon.species.url);
  const entry = species.genera.find((item) => item.language.name === "en");

  return entry?.genus ?? "Pokémon";
}

export async function isLegendOrMyth(pokemonName: string): Promise<boolean> {
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
    );

  return embed;
}

function cmToFeetConversion(cm: number) {
  var realFeet = cm / 30.48;
  var feet = Math.floor(realFeet);
  var inches = ((realFeet - feet) * 12).toFixed(0);
  return feet + "'" + inches + '"';
}
function kgToPounds(kg: number) {
  return (kg * 2.20452262).toFixed(1);
}

export function getPokemonUrl(pokemonName: string) {}

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
  pokemonGender: number,
  shiny: boolean,
) {
  const pokemon = await P.getPokemonByName(pokemonName.toLowerCase());
  const sprites = pokemon.sprites;

  // if it is female
  if (pokemonGender === 2) {
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
