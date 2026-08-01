import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EmbedBuilder } from "discord.js";

import * as pokehelper from "./pokeHelper";

import * as submitHelper from "./submitHelper";
import * as characterHelper from "./characterHelper";

export async function getReservesEmbed() {
  await loadUsers();

  const characters: Character[] = [];

  if (!charaDex?.[id]) {
    return characters;
  }

  const embed = new EmbedBuilder()
    .setTitle(
      `Evolutionary Destination`,
    )
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    )
    .setColor(color.hexcode)
    .setDescription(`An 'Evolutionary Destination' describes the species that your pokemon partner will eventually evolve into. 
        
        Each 'Evolution Destination' can only be claimed once.
        Different forms are considered their own evolutionary destination, such as Ninetales and Alolan Ninetales.
        These must be permanent form changes, that cannot be changed both in and out of battle (ie. Oricorio or Rotom and all its forms would be considered only one destination).
        
        Someone may claim a Pikachu as a destination, but it cannot evolve into a Raichu. 
        Another could start with a Pichu, though it is unable to evolve entirely.
        A third person may claim a Raichu, and a fourth person can claim Alolan Raichu.
        These four characters can coexist at the same time, but they will all start with Pichu.

        Only fully evolved evolution destinations will get a chance to roll for Alpha.
        Be aware that these destinations cannot be changed once a character is approved.
        `)
    .setImage("https://klipy.com/gifs/pixel-fireflies").setAuthor("Banner by AnasAbdin on Twitter");

  return embed;
}
