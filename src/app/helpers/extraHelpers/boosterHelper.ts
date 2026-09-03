import * as characterHelper from "../characterHelper";
import { Client, ColorResolvable, EmbedBuilder } from "discord.js";
import * as pokehelper from "../pokeHelper";
const monthlyRerolls = 3;

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    BOOSTER ROLE
///////////////////////////////////////////////////////////////////////////////////////////////////////

export function isValidHex(color: string): boolean {
  return /^#?[0-9A-F]{6}$/i.test(color);
}
async function createRole(client: Client, id: string) {
  const charaDex = await characterHelper.getUsers();
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
    await characterHelper.saveUsersExternal(charaDex);
  }
}
export async function removeBoosterRole(client: Client, id: string) {
  const charaDex = await characterHelper.getUsers();
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
  const charaDex = await characterHelper.getUsers();

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
  const charaDex = await characterHelper.getUsers();
  await createRole(client, id);
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)!;
  const role = guild.roles.cache.get(charaDex[id]?.booster_role!);

  await role?.edit({
    name: name,
  });
}

export async function getRerolls(id: string): Promise<number> {
  const charaDex = await characterHelper.getUsers();
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
  const charaDex = await characterHelper.getUsers();
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
  await characterHelper.saveUsersExternal(charaDex);
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
  const charaDex = await characterHelper.getUsers();

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
  await characterHelper.saveUsersExternal(charaDex);
  embed.setThumbnail(await characterHelper.getPartnerSprite(id, name));

  return embed;
}
