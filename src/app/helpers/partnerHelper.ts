import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import * as charaHelper from "./characterHelper";
import * as pokeHelper from "./pokeHelper";

import { OocPartner } from "./characterHelper";
import { ButtonStyle, Client, resolveColor } from "discord.js";

export const sessions = new Map<string, choices>();

export interface choices {
  starter1: partnerProspect;
  starter2: partnerProspect;
  starter3: partnerProspect;
}

// export interface OocPartner {
//   registeredOn: Date;
//   lastInteracted: Date;
//   gender: string;
//   ability: number;
//   nickname?: string;
//   sizeMult: number;
//   species: string;
//   shiny: boolean;
//   nature: string;
// }

export interface partnerProspect {
  sizeMult: number;
  gender: string;
  ability: number;
  species: string;
  shiny: boolean;
  nature: string;
}

export async function getPartner(id: string) {
  return charaHelper.getOOCPartner(id);
}

export async function generateChoices(
  id: string,
  type1: string,
  type2: string,
  type3: string,
) {
  const pokemon1 = await pokeHelper.getRandomPokemonByType(type1);
  const basemon1 = await pokeHelper.findBaseMon(pokemon1);

  const pokemon2 = await pokeHelper.getRandomPokemonByType(type2);
  const basemon2 = await pokeHelper.findBaseMon(pokemon2);

  const pokemon3 = await pokeHelper.getRandomPokemonByType(type3);
  const basemon3 = await pokeHelper.findBaseMon(pokemon3);

  const prospect1 = await generatePartnerProspect(basemon1.name);
  const prospect2 = await generatePartnerProspect(basemon2.name);
  const prospect3 = await generatePartnerProspect(basemon3.name);

  const choices: choices = {
    starter1: prospect1,
    starter2: prospect2,
    starter3: prospect3,
  };

  sessions.set(id, choices);
}

export async function getProspects(id: string) {
  const prospects = sessions.get(id)!;

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`starter_select:${id}:1`)
      .setLabel(`${pokeHelper.displayName(prospects.starter1.species)}`)
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId(`starter_select:${id}:2`)
      .setLabel(`${pokeHelper.displayName(prospects.starter2.species)}`)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`starter_select:${id}:3`)
      .setLabel(`${pokeHelper.displayName(prospects.starter3.species)}`)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`starter_select:${id}:reroll`)
      .setLabel(`${pokeHelper.displayName("Reroll")}`)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`starter_select:${id}:retake`)
      .setLabel(`${pokeHelper.displayName("Retake Quiz")}`)
      .setStyle(ButtonStyle.Danger),
  );

  const embed1 = await getPartnerProspectEmbed(prospects.starter1);
  const embed2 = await getPartnerProspectEmbed(prospects.starter2);
  const embed3 = await getPartnerProspectEmbed(prospects.starter3);

  return {
    embeds: [embed1, embed2, embed3],
    components: [row],
    ephemeral: true,
  };
}

export async function generatePartnerProspect(species: string) {
  const shinyRoll = Math.floor(Math.random() * 20) + 1;
  const alphaRoll = Math.floor(Math.random() * 20) + 1;

  const genders = await pokeHelper.getPossibleGenders(species);
  const nature = Math.floor(Math.random() * 25) + 1;
  const ability = Math.floor(Math.random() * 3) + 1;

  var sizeMult;
  if (alphaRoll == 20) {
    sizeMult = 2;
  } else {
    sizeMult = Math.random() / 2 + 0.75;
  }

  const partnerProspect: partnerProspect = {
    sizeMult: sizeMult,
    gender: genders[Math.floor(Math.random() * genders.length)]!.name,
    ability: ability,
    species: species,
    shiny: shinyRoll === 20,
    nature: `${nature}`,
  };

  return partnerProspect;
}

export async function claimPartnerProspect(id: string, starter: string) {
  const choices = sessions.get(id)!;
  var partner;
  if (starter == "1") {
    partner = choices.starter1;
  } else if (starter == "2") {
    partner = choices.starter2;
  } else {
    partner = choices.starter3;
  }

  const partnerProspect: OocPartner = {
    sizeMult: partner.sizeMult,
    registeredOn: new Date(),
    lastInteracted: new Date(),
    gender: partner.gender,
    ability: partner.ability,
    shiny: partner.shiny,
    species: partner.species,
    nature: partner.nature,
    experience: 0,
  };

  await charaHelper.setOOCPartner(id, partnerProspect);
}

export async function deleteProspects(id: string) {
    sessions.delete(id);
}


export async function getPartnerProspectEmbed(
  prospect: partnerProspect,
): Promise<EmbedBuilder> {
  const alphaCheck = pokeHelper.getSize(prospect.sizeMult);
  const shinyCheck =
    prospect.shiny == true ? `<:ea_shinyicon:1533355848217399419>` : ``;
  const species = `**Species** | ${pokeHelper.displayName(prospect.species)}`;

  const pokemon = await pokeHelper.findPokemon(prospect.species);
  const gender = `**Gender** | ${prospect.gender}\n`;
  const ability = `**Ability** | ${pokeHelper.getAbilityName(pokemon!, prospect.ability)}\n`;
  const nature = `**Nature** | ${charaHelper.getNatureFromValue(prospect.nature)}\n`;

  const dexEntry = await pokeHelper.getRandDexEntry(prospect.species);
  const color = pokeHelper.colors[`red`]!;

  const image = await pokeHelper.getSprite(
    prospect.species,
    prospect.gender,
    prospect.shiny,
  );

  const embed = new EmbedBuilder();
  embed
    .setColor(
      prospect.shiny || prospect.sizeMult == 2
        ? resolveColor(`#ffffff`)
        : resolveColor(color.hexcode),
    )
    .setDescription(
      `${species} ${alphaCheck} ${shinyCheck}
    ${gender}${ability}${nature}${dexEntry}`,
    )
    .setThumbnail(image);
  if (prospect.shiny || prospect.sizeMult == 2) {
    embed.setFooter({ text: `Oh? How curious...` });
  }
  return embed;
}
function getLevelFromExp(exp: number): number {
  return Math.min(100, Math.max(Math.floor(Math.cbrt(exp)), 1));
}


export async function getPartnerEmbed(username: string, id: string) {
  const partner = await charaHelper.getOOCPartner(id);
  if (partner) {
    const metOn = `**Met On** | <t:${Math.floor(new Date(partner.registeredOn).getTime() / 1000)}:D>\n`;
    const nick = partner.nickname ? `${partner.nickname} | ` : ``;

    const species = `**Species** | ${pokeHelper.displayName(partner.species)}`;
    const alphaCheck = pokeHelper.getSize(partner.sizeMult);
    const shinyCheck =
      partner.shiny == true ? `<:ea_shinyicon:1533355848217399419>` : ``;

    const pokemon = await pokeHelper.findPokemon(partner.species);
    const scaledHeight = pokemon!.height * partner.sizeMult;
    const scaledWeight = pokemon!.weight * Math.pow(partner.sizeMult, 3);
    const level = `**Level** | ${getLevelFromExp(partner.experience)}\n`
    const height = `${(scaledHeight * 0.1).toFixed(1)} m | ${pokeHelper.cmToFeetConversion(scaledHeight * 10)}`;
    const weight = `${(scaledWeight * 0.1).toFixed(1)} kg | ${pokeHelper.kgToPounds(scaledWeight * 0.1)} lbs`;

    const gender = partner.gender ? `**Gender** | ${partner.gender}\n` : ``;
    const ability = partner.ability
      ? `**Ability** | ${pokeHelper.getAbilityName(pokemon!, partner.ability)}\n`
      : ``;
    const nature = partner.nature
      ? `**Nature** | ${charaHelper.getNatureFromValue(partner.nature)}\n`
      : ``;

    const dexEntry = await pokeHelper.getRandDexEntry(partner.species);
    const color = await pokeHelper.getColor(pokemon!);
    const image = await pokeHelper.getSprite(
      partner.species,
      partner.gender,
      partner.shiny,
    );

    const embed = new EmbedBuilder();
    embed
      .setTitle(
        `${nick}${`${username}'s ${pokeHelper.displayName(partner.species)}`}`,
      )
      .setColor(resolveColor(color.hexcode))
      .setDescription(
        `${species} ${alphaCheck} ${shinyCheck}
    ${level}${gender}${ability}${nature}${metOn}${dexEntry}`,
      )
      .setFooter({
        text: color.bannerCreds!,
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
      .setImage(color.bannerLink!);
    return embed;
  } else {
    return new EmbedBuilder()
      .setDescription(`Partner could not be found!`)
      .setColor(resolveColor("Red"));
  }
}
