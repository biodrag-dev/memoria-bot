import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EmbedBuilder, Interaction } from "discord.js";

import * as pokehelper from "./pokeHelper";

import * as submitHelper from "./submitHelper";
import * as characterHelper from "./characterHelper";

export async function updateEmbed(
  channel: any,
  message_id: string,
  embed: EmbedBuilder,
) {
  //const channel = await interaction.client.channels.fetch(`${channel_id}`);
  const msg = await channel.messages.fetch(`${message_id}`);
  await msg.edit({
    embeds: [embed],
  });
}

export async function updateReservesEmbed(client) {
  const channel = await client.channels.fetch(process.env.RESERVATIONS_CHANNEL);
  if (!channel?.isTextBased()) return;

  const msgOne = await channel.messages.fetch(
    `${process.env.RESERVATIONS_MSG_ONE}`,
  );
  const embedOne = await getReservesOneEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });

  const msgTwo = await channel.messages.fetch(
    `${process.env.RESERVATIONS_MSG_TWO}`,
  );
  const embedTwo = await getReservesTwoEmbed();
  await msgTwo.edit({
    content: ``,
    embeds: [embedTwo],
  });

  const msgThree = await channel.messages.fetch(
    `${process.env.RESERVATIONS_MSG_THREE}`,
  );
  const embedThree = await getReservesThreeEmbed();
  await msgThree.edit({
    content: ``,
    embeds: [embedThree],
  });
}

export async function updateServerRulesEmbed(client) {
  const channel = await client.channels.fetch(process.env.SERVER_RULES_CHANNEL);
  const msgOne = await channel.messages.fetch(
    `${process.env.SERVER_RULES_MSG_ONE}`,
  );
  const embedOne = await getServerRulesEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateCharacterRulesEmbed(client) {
  const channel = await client.channels.fetch(
    process.env.CHARACTER_RULES_CHANNEL,
  );
  const msgOne = await channel.messages.fetch(
    `${process.env.CHARACTER_RULES_MSG_ONE}`,
  );
  const embedOne = await getCharacterRulesOneEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });

  const msgTwo = await channel.messages.fetch(
    `${process.env.CHARACTER_RULES_MSG_TWO}`,
  );
  const embedTwo = await getCharacterRulesTwoEmbed();
  await msgTwo.edit({
    content: ``,
    embeds: [embedTwo],
  });
}

export async function getReservesOneEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`Evolutionary Destination`)
    .setColor("#d11a1a")
    .setDescription(
      `An 'Evolutionary Destination' describes the species that your pokemon partner will eventually evolve into.
        
        Each 'Evolution Destination' can only be claimed by one character at a time. Different forms are considered their own evolutionary destination, such as Ninetales and Alolan Ninetales.
        These must be permanent form changes that cannot be changed both in and out of battle (ie. Oricorio or Rotom and all its forms would be considered only one destination).
        
        For example, someone may claim a Pikachu as a destination, but it cannot evolve into a Raichu. Another could claim a Pichu, though it is unable to evolve entirely. A third person may claim a Raichu, and a fourth person can claim Alolan Raichu. These four characters can coexist at the same time, but they will all start with Pichu.

        Keep in mind that these destinations cannot be changed once a character is approved.`,
    )
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/494.png?format=webp&quality=lossless`,
    )
    .setImage(
      "https://64.media.tumblr.com/4c989428ba947bc4966e07e76d36bd28/118ec01107834a73-07/s540x810/5c2aa6ffdba2c64d3deb6fb0a646313eb247c561.gif",
    )
    .setFooter({
      text: "Banner by @waneella on Tumblr",
      //,iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  return embed;
}

export async function getReservesTwoEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`Approved Evolutionary Destinations`)
    .setColor("#ddad10")
    .setDescription(`${await submitHelper.getAllApprovedPartnerEntries()} `)
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png?format=webp&quality=lossless`,
    )
    .setImage(
      "https://i.redd.it/yg62pmx9dhra1.gif?width=960&format=mp4&s=6643eb3a4de32a8b64cf45cb2474b68f77bfebe6",
    )
    .setFooter({
      text: "Banner by @AnasAbdin on Tumblr",
      //,iconURL: "https://i.imgur.com/AfFp7pu.png",
    });
  return embed;
}

export async function getReservesThreeEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`Reservations`)
    .setColor("#188eac")
    .setDescription(
      `Looking to reserve an Evolutionary Destination in advance? Use **/submit partner-reserve**! Note that reservervations cannot be changed to another species until a week has passed, you must submit with your current reservation, and there are no extensions.
      
      ${await submitHelper.getAllReservedPartnerEntries()}`,
    )
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png?format=webp&quality=lossless`,
    )
    .setImage(
      "https://static2.klipy.com/ii/f87f46a2c5aeaeed4c68910815f73eaf/27/de/PSYjpPT7.gif",
    )
    .setFooter({
      text: "Banner by @AnasAbdin on Tumblr",
      //,iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  return embed;
}

export async function getServerRulesEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐒𝐄𝐑𝐕𝐄𝐑 𝐑𝐔𝐋𝐄𝐒`)
    .setColor("#67a5eb")
    .setDescription(
      `1. Be respectful and civil.
> Treat everyone with respect and keep drama out of this server. We want to make this a welcoming space, so please keep in mind that there is a difference between banter and scorn. Even if you have good intentions, other people may not have the same sense of humor.

2. We are a 16+ server.
> If you are 15 or below, please direct yourself to the exit or we will do it for you. You're welcome to join at a later day when you do reach that age, but not now.

3. NSFW and excessive gore are banned.
> If, for some reason, they do need to be mentioned, please censor them with the appropriate tags. We discourage discussion about topics such as self-harm, abuse, suicide, and political matters due to how sensitive these subjects may be. Bear in mind that we are a community open to minors.

3. No discrimination.
> This is an inclusive space, so discrimination of any kind will not be tolerated. Making derogatory remarks against POC, disabled, LGBTQ+, religion, etc. can warrant warnings, kicks, or even an instant ban. We ask that you do not use slurs even if you have reclaimed them, as it can make those who haven't uncomfortable.

4. Take arguments to DMs.
> Respectful debates are allowed, such as discussing favorite foods or games. If a discussion is getting heated, please drop the topic or take it to DMs. If it continues within the server, it may lead to timeouts or warnings for anyone instigating or continuing the conversation.

5. No alt accounts.
> Alt accounts are not allowed, as they're typically used to bypass OC limits or bans. If you need to transfer accounts, please let a staff member know beforehand and we can make the adjustments necessary.

6. Don’t ask for personal information or doxx yourself.
> For safety reasons, please do not send people any intrusive messages or ask about personal information without their permission. Any face reveals within the server will be deleted to protect your privacy, and sharing your first name is fine, but a full legal name is not safe on the internet.

7. Behave appropriately.
> Staff will not be micromanaging every interaction. Do not attempt to look for loopholes in the rules or minimod – if you’re ever uncertain, feel free to ask us!

8. Listen to staff.
> We ask that you listen to what the staff say. We are here to assist you, and meeting that with hostility is unacceptable. At the same time, staff are not above constructive criticism. It is okay for server members to disagree with us so long as it is done in a respectful manner and vice versa.

9. No advertising.
> Advertising other servers here is strictly prohibited and will be met with either a kick or ban. If you wish to partner with us, please create a ticket in <#1533686056019300452>!

10. No venting.
> We are not medical professionals, so any advice given or improper handling may lead to more harm than good at times. If you need to vent, we suggest taking a look at <#1533714323271323738>. If you would like to take a break, we’re willing to accommodate you!

11. Keep it out of staff DMs.
> For both organization and our staff’s safety, we ask that you avoid DMing staff for server/moderation purposes. If you have something private you’d like to discuss with staff (e.g. harassment from another server member or a private character idea), please open up a ticket in <#1533686056019300452>. The password is \`starburst\`.`,
    )
    .setImage("https://1041uuu.jp/Gallery/b/b27.gif")
    .setFooter({
      text: "Banner by @1041uuu on Tumblr",
      //,iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  return embed;
}

export async function getCharacterRulesOneEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐂𝐇𝐀𝐑𝐀𝐂𝐓𝐄𝐑 𝐑𝐔𝐋𝐄𝐒`)
    .setColor("#4ce959")
    .setDescription(
      `1. Credit artists.
> Whether it’s created through doll-maker websites such as Picrew or personal or commissioned artwork, we want to make sure that the artist’s efforts are appreciated! A direct link to the artist's page/post/picrew is mandatory for approval. Make sure that you have permission to use the artist’s work, so this means no taking someone else’s OC from Pinterest. Intentional use of AI generated material will result in a ban.

2. No faceclaims or carbon copies.
> To encourage creativity, using characters from media as faceclaims is not allowed, such as using Satoru Gojo as a representation of what your character looks like. Written descriptions are accepted, but if you’d like a visual, we recommend using resources like Picrew! Inspiration is great, but make sure to add your own unique flair to it too! OCs shouldn’t be a 1:1 copy of another character.

3. Research your topics.
> Please make sure the portrayal of whatever your character is representing (disability, culture, etc.) is properly researched, especially when depicting mental illnesses and disorders. Criminalizing mental illness (e.g. a villain whose DID is the motive behind their crimes) will automatically be denied and may potentially be grounds for removal.

4. No heavy politics.
> We ask that you do not bring in or draw parallels to real-world politics here. This is not the place to discuss them.

5. Don't flatten your character!
> Characters should have depth! They shouldn’t just be a one-dimensional trope or have only positive/negative traits, they should have a good mix of both!

6. No canons.
> We are an OC-only server, so please leave all mentions of canon characters out of your OC’s backstory!

7. One Pokémon evolutionary destination per person.
> Pokémon evolutionary destinations are unique in this server. Two OCs cannot both have an Absol, so please check if the Pokémon you have in mind is already taken! Please take a look at <#${process.env.RESERVATIONS_CHANNEL}> for more info. We also allow species reservations that last 1 month.

8. Three Character limit.
> As of the moment, everyone will have a 3 character limit, one for each house (Victini, Mew, Jirachi). We want to focus on quality over quantity!`,)
    .setFooter({
      text: "Banner by @1041uuu on Tumblr",
      //,iconURL: "https://i.imgur.com/AfFp7pu.png",
    }).setImage(`https://64.media.tumblr.com/aa05fe3b460d3dd0b4324a12f423ec72/c6c80f2198878c5f-18/s540x810/3ad5dbf237149e13e763f9ec9013e3306d918a6b.gif`);

  return embed;
}

export async function getCharacterRulesTwoEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐋𝐈𝐌𝐈𝐓𝐄𝐃/𝐁𝐀𝐍𝐍𝐄𝐃 𝐂𝐇𝐀𝐑𝐀𝐂𝐓𝐄𝐑 𝐓𝐑𝐀𝐈𝐓𝐒`)
    .setColor("#1ba851")
    .setDescription(
      `1. Limitation: Human OCs only.
> We do not allow OCs that are only Pokémon, splices (half Pokémon, half human), a Ditto in disguise, etc. They must be fully human. 

2. Limitation: Psychics.
> The extent of Psychic powers is that they can lift only minor objects such as a Poké Ball. We do not allow Psychics to read others’ emotions, communicate via telepathy, or teleportation.

3. Limitation: Wealth and Influence.
> We allow characters to be fairly rich, but not a level where they can purchase a building with their allowance. OCs that can influence an entire region politically are also not permitted, and 'famous' characters should still be relatively realistic (ie. not having billions of followers).

4. Limitation: Age restrictions.
> Characters must be at least 16 years old or older.

5. Banned: Aura Users.
> Aura is difficult to balance, and can often lead to non-Aura Users feeling left out in lore or event functionalities.

6. Banned: Murderers/Violent Criminals.
> Minor offenses such as theft are allowed, but severe or violent crimes such as murder will be denied. This server is an academy setting!`,
    )
    .setImage(
      "https://64.media.tumblr.com/3ebef054c877d03c507aa8c40149908b/6ea0a0e867ebf441-0d/s540x810/b373eb4bbf73d955bc00c18d170b4093d6ad9044.gif",
    )
    .setFooter({
      text: "Banner by @1041uuu on Tumblr",
      //,iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  return embed;
}
