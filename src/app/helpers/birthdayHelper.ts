import { Client, EmbedBuilder } from "discord.js";
import * as characterHelper from "./characterHelper";

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

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    BIRTHDAY COMMANDS
///////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getAllPersonalBdays(
  client: Client,
  id: string,
): Promise<EmbedBuilder> {
  const charaDex = await characterHelper.getUsers()
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
  const charaDex = await characterHelper.getUsers()
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
  const charaDex = await characterHelper.getUsers()
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
  const charaDex = await characterHelper.getUsers()
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
  const charaDex = await characterHelper.getUsers()

  try {
    const bday = new Date(0);
    bday.setMonth(month, day);

    if (!charaDex[id]) {
      charaDex[id] = {
        characters: {},
      };
    }

    charaDex[id].birthday = bday;
    await characterHelper.saveUsersExternal(charaDex);
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
  const charaDex = await characterHelper.getUsers()
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
  const charaDex = await characterHelper.getUsers()

  const bdays: { userId: string; character: characterHelper.Character }[] = [];
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
  const charaDex = await characterHelper.getUsers()

  const bdays: { userId: string; character: characterHelper.Character }[] = [];
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
  const charaDex = await characterHelper.getUsers()
  try {
    const bday = new Date(0);
    bday.setMonth(month, day);

    charaDex[id]!.characters[name]!.birthday = bday;
    await characterHelper.saveUsersExternal(charaDex);
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
