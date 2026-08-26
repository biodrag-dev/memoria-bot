import {
  Client,
  EmbedBuilder,
  ForumChannel,
  Interaction,
  TextChannel,
} from "discord.js";

import * as submitHelper from "./submitHelper";

export async function updateAllEmbeds(client: Client) {
  // updateReservesEmbed(client);
  // updateServerRulesEmbed(client);
  // updateCharacterRulesEmbed(client);
  // updateVerificationEmbed(client);
  // updateRolesEmbed(client);
  // updateRoleplayRules(client);
  // updateFaqEmbed(client);
  // //thread is archived
  // //updatePartnershipRules(client);
  // updateTemplateEmbed(client);
  //   //thread is archived
  // // updateStaffNpcEmbed(client);
  // updateResourcesEmbed(client);
  // updateAllLoreEmbeds(client)
}

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

export async function sendCharaBdayEmbed(
  client: Client,
  name: string,
  user: string,
  art_link: string | undefined,
  artist_credits: string | undefined,
) {
  const channel = (await client.channels.fetch(
    `${process.env.RP_DISC_CHANNEL}`,
  )) as TextChannel;

  const embedOne = await getCharaBdayEmbed(
    art_link,
    artist_credits,
    name,
    user,
  );
  await channel.send({
    content: `<@${user}>`,
    embeds: [embedOne],
  });
}

export async function sendOOCBirthdayEmbed(client: Client, user: string) {
  const channel = (await client.channels.fetch(
    `${process.env.GEN_CHAT_CHANNEL}`,
  )) as TextChannel;

  const embedOne = await getBirthdayEmbed(client, user);
  await channel.send({
    content: `<@${user}>`,
    embeds: [embedOne],
  });
}

export async function sendEnterMsg(client: Client, user: string) {
  const channel = (await client.channels.fetch(
    `${process.env.DOOR_CHANNEL}`,
  )) as TextChannel;

  const embedOne = await getJoinEmbed(client, user);
  await channel.send({
    embeds: [embedOne],
  });
}

export async function sendLeaveMsg(client: Client, user: string) {
  const channel = (await client.channels.fetch(
    `${process.env.DOOR_CHANNEL}`,
  )) as TextChannel;

  const embedOne = await getLeaveEmbed(client, user);
  await channel.send({
    embeds: [embedOne],
  });
}

export async function sendBoostMsg(client: Client, user: string) {
  const channel = (await client.channels.fetch(
    `${process.env.GEN_CHAT_CHANNEL}`,
  )) as TextChannel;

  const embedOne = await getBoostEmbed(client, user);
  await channel.send({
    embeds: [embedOne],
  });
}

export async function sendWelcomeMsg(client: Client, user: string) {
  const channel = (await client.channels.fetch(
    `${process.env.GEN_CHAT_CHANNEL}`,
  )) as TextChannel;

  const embedOne = await getPostVerifyEmbed(client, user);
  await channel.send({
    content: `<@${user}>`,
    embeds: [embedOne],
  });
}

export async function updateAllLoreEmbeds(client: Client) {
  const forum = (await client.channels.fetch(
    `1527303791500722256`,
  )) as ForumChannel;
  const historyThread = await forum.threads.fetch(`1540937672405553195`);
  const historyMessage = await historyThread!.fetchStarterMessage();
  historyMessage?.edit({ embeds: [await getLoreHistoryEmbed()] });

  const academyThread = await forum.threads.fetch(`1540937573696806963`);
  const academyMessage = await academyThread!.fetchStarterMessage();
  academyMessage?.edit({ embeds: await getLoreDexlightAcademyEmbed() });

  const circuitThread = await forum.threads.fetch(`1540870356175163504`);
  const circuitMessage = await circuitThread!.fetchStarterMessage();
  circuitMessage?.edit({ embeds: [await getLoreTrialCircuitEmbed()] });

  const mapThread = await forum.threads.fetch(`1540868211652952206`);
  const mapMessage = await mapThread!.fetchStarterMessage();
  await mapMessage?.edit({ embeds: [await getLoreRegionMap()] });
}

export async function updateStaffNpcEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.STORY_NPC_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.STORY_NPC_MSG_ONE}`,
  );
  const embedOne = await getStaffNpcEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateVerificationEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.VERIFY_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(`${process.env.VERIFY_MSG_ONE}`);
  const embedOne = await getVerifyEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateFaqEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.FAQ_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(`${process.env.FAQ_MSG_ONE}`);
  const embedOne = await getFaqOneEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });

  const msgTwo = await channel.messages.fetch(`${process.env.FAQ_MSG_TWO}`);
  const embedTwo = await getFaqTwoEmbed();
  await msgTwo.edit({
    content: ``,
    embeds: [embedTwo],
  });

  const msgThree = await channel.messages.fetch(`${process.env.FAQ_MSG_THREE}`);
  const embedThree = await getFaqThreeEmbed();
  await msgThree.edit({
    content: ``,
    embeds: [embedThree],
  });

  const msgFour = await channel.messages.fetch(`${process.env.FAQ_MSG_FOUR}`);
  const embedFour = await getFaqFourEmbed();
  await msgFour.edit({
    content: ``,
    embeds: [embedFour],
  });
}

export async function updateResourcesEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.RESOURCES_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.RESOURCES_MSG_ONE}`,
  );
  const embedOne = await getResourcesEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updatePartnershipRules(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.PARTNERSHIP_RULES_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.PARTNERSHIP_RULES_MSG_ONE}`,
  );
  const embedOne = await getPartnershipRulesEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateRolesEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.SELF_ROLES_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.SELF_ROLES_MSG_ONE}`,
  );
  const embedOne = await getRolesOneEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });

  const msgTwo = await channel.messages.fetch(
    `${process.env.SELF_ROLES_MSG_TWO}`,
  );
  const embedTwo = await getRolesTwoEmbed();
  await msgTwo.edit({
    content: ``,
    embeds: [embedTwo],
  });

  const msgThree = await channel.messages.fetch(
    `${process.env.SELF_ROLES_MSG_THREE}`,
  );
  const embedThree = await getRolesThreeEmbed();
  await msgThree.edit({
    content: ``,
    embeds: [embedThree],
  });

  const msgFour = await channel.messages.fetch(
    `${process.env.SELF_ROLES_MSG_FOUR}`,
  );
  const embedFour = await getRolesFourEmbed();
  await msgFour.edit({
    content: ``,
    embeds: [embedFour],
  });

  const msgFive = await channel.messages.fetch(
    `${process.env.SELF_ROLES_MSG_FIVE}`,
  );
  const embedFive = await getRolesFiveEmbed();
  await msgFive.edit({
    content: ``,
    embeds: [embedFive],
  });

  const msgSix = await channel.messages.fetch(
    `${process.env.SELF_ROLES_MSG_SIX}`,
  );
  const embedSix = await getRolesSixEmbed();
  await msgSix.edit({
    content: ``,
    embeds: [embedSix],
  });
}

export async function updateReservesEmbed(client: Client) {
  const channel = await client.channels.fetch(
    `${process.env.RESERVATIONS_CHANNEL}`,
  );
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

export async function updateServerRulesEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.SERVER_RULES_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.SERVER_RULES_MSG_ONE}`,
  );
  const embedOne = await getServerRulesEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateRoleplayRules(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.RP_RULES_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.RP_RULES_MSG_ONE}`,
  );
  const embedOne = await getRoleplayRulesEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateTemplateEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.TEMPLATE_CHANNEL}`,
  )) as TextChannel;
  const msgOne = await channel.messages.fetch(
    `${process.env.TEMPLATE_MSG_ONE}`,
  );
  const embedOne = await getTemplateEmbed();
  await msgOne.edit({
    content: ``,
    embeds: [embedOne],
  });
}

export async function updateCharacterRulesEmbed(client: Client) {
  const channel = (await client.channels.fetch(
    `${process.env.CHARACTER_RULES_CHANNEL}`,
  )) as TextChannel;
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

async function getReservesOneEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐄𝐕𝐎𝐋𝐔𝐓𝐈𝐎𝐍𝐀𝐑𝐘 𝐃𝐄𝐒𝐓𝐈𝐍𝐀𝐓𝐈𝐎𝐍𝐒`)
    .setColor("#d11a1a")
    .setDescription(
      `Each 'Evolution Destination' can only be claimed by one character at a time. Different forms are considered their own evolutionary destination, such as Ninetales and Alolan Ninetales. These must be permanent form changes that cannot be changed both in and out of battle (ie. Oricorio or Rotom and all its forms would be considered only one destination).

For example, someone may claim a Pikachu as a destination, but it cannot evolve into a Raichu. Another could claim a Pichu, though it is unable to evolve entirely. A third person may claim a Raichu, and a fourth person can claim Alolan Raichu. These four characters can coexist at the same time, but they will all start with Pichu.

Keep in mind that these destinations cannot be changed once a character is approved.`,
    )
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/494.png?format=webp&quality=lossless`,
    )
    .setImage(
      "https://i.pinimg.com/originals/15/de/50/15de50852da9987a3c15d84d4b25f45d.gif",
    )
    .setFooter({
      text: "banner by @waneella on tumblr",
    });

  return embed;
}

async function getReservesTwoEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 𝐃𝐄𝐒𝐓𝐈𝐍𝐀𝐓𝐈𝐎𝐍𝐒`)
    .setColor("#ddad10")
    .setDescription(`${await submitHelper.getAllApprovedPartnerEntries()} `)
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png?format=webp&quality=lossless`,
    )
    .setImage(
      "https://i.redd.it/yg62pmx9dhra1.gif?width=960&format=mp4&s=6643eb3a4de32a8b64cf45cb2474b68f77bfebe6",
    )
    .setFooter({
      text: "banner by @anasabdin on tumblr",
    });
  return embed;
}

async function getReservesThreeEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐎𝐍𝐆𝐎𝐈𝐍𝐆 𝐑𝐄𝐒𝐄𝐑𝐕𝐀𝐓𝐈𝐎𝐍𝐒`)
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
      text: "banner by @anasabdin on tumblr",
    });

  return embed;
}

async function getServerRulesEmbed() {
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
> This is an inclusive space, so discrimination of any kind will not be tolerated. Making derogatory remarks against POC, disabled, LGBTQ+, religion, etc. can warrant warnings, kicks, or even an instant ban. We ask that you do not use slurs even if you have personally reclaimed them, as it can make those who haven't uncomfortable.

4. Take arguments to DMs.
> Respectful debates are allowed, such as discussing favorite foods or games. If a discussion is getting heated, please drop the topic or take it to DMs. If it continues within the server, it may lead to timeouts or warnings for anyone instigating or continuing the conversation.

5. No alt accounts.
> Alt accounts are not allowed, as they're typically used to bypass OC limits or bans. If you need to transfer accounts, please let a staff member know beforehand and we can make the adjustments necessary.

6. Don’t ask for personal information or doxx yourself.
> For safety reasons, please do not send people any intrusive messages or ask about personal information without their permission. Any face reveals within the server will be deleted to protect your privacy, and sharing your first name is fine, but a full legal name is not safe on the internet.

7. Behave appropriately.
> Staff will not be micromanaging every interaction. Do not attempt to look for loopholes in the rules or minimod – if you’re ever uncertain, feel free to ask us!

8. No AI.
> Please do not share any AI-generated content of any form, whether it be art, writing, or music. Doing so intentionally may result in a ban.

9. Listen to staff.
> We ask that you listen to what the staff say. We are here to assist you, and meeting that with hostility is unacceptable. At the same time, staff are not above constructive criticism. It is okay for server members to disagree with us so long as it is done in a respectful manner and vice versa.

10. No advertising.
> Advertising other servers here is strictly prohibited and will be met with either a kick or ban. If you wish to partner with us, please create a ticket in <#1533686056019300452>!

11. No venting.
> We are not medical professionals, so any advice given or improper handling may lead to more harm than good at times. If you need to vent, we suggest taking a look at <#1533714323271323738>. If you would like to take a break, we’re willing to accommodate you!

12. Keep it out of staff DMs.
> For both organization and our staff’s safety, we ask that you avoid DMing staff for server/moderation purposes. If you have something private you’d like to discuss with staff (e.g. harassment from another server member or a private character idea), please open up a ticket in <#1533686056019300452>. The password is \`starburst\`.`,
    )
    .setImage("https://1041uuu.jp/Gallery/b/b27.gif")
    .setFooter({
      text: "banner by @1041uuu on tumblr",
    });

  return embed;
}

async function getRoleplayRulesEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐑𝐎𝐋𝐄𝐏𝐋𝐀𝐘 𝐑𝐔𝐋𝐄𝐒`)
    .setColor("#657c58")
    .setDescription(
      `1. Roleplay Rules.
> A character can be in multiple locations at once, so long as it makes sense chronologically. If you are to engage in multiple roleplays at the same time, please make it clear which RP happens when.

2. Proper RP etiquette.
> Understand that everyone in the server has their own lives, and please be patient in regards to RP response times. However, communication is a two way street, so also don't go ghosting your RP partner. In the same vein, do not control someone else's OCs or Metagame (where the character has knowledge that they have learned OOC but not IRP). ALWAYS ask if you may join in on a roleplay, whether it is currently planning or ongoing.
 
3. Permission to Injure.
> We typically operate on a Permission to Injure rule, where the other roleplayer's permission is required in order to cause injury to their character. In the case of poor decision-making,  staff can override this to invoke Reason to Injure. However, you will be notified beforehand and will also be given a chance to retcon the poor decisions in question if need be.

4. Content Guidelines
> Standard fantasy violence is allowed, but potentially triggered topics should be censored or omitted entirely as server rules still apply. Pokemon universe humans are way tougher than their IRL counterparts, so they're durable enough to withstand a Pokemon's attack or two! This is intended to be a light-hearted roleplay, and staff may intervene if your roleplay is unnecessarily dark. 

5. Writing Guidelines
> Our server writing minimum is semi-literate, so try to aim for 5 sentences minimum. Higher quality writing is expected in terms of proper punctuation, length and grammar. Additionally, to avoid channel clutter, roleplay should be conducted in threads.
`,
    )
    .setImage(
      "https://i.pinimg.com/originals/2d/dd/65/2ddd65d337a48d0c8dc223f849c3dc5a.gif",
    )
    .setFooter({
      text: "banner by @1041uuu on tumblr",
    });

  return embed;
}

async function getCharacterRulesOneEmbed() {
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
> As of the moment, everyone will have a 3 character limit, one for each house (Victini, Mew, Jirachi). We want to focus on quality over quantity! This also means that you cannot make two characters in the same house.`,
    )
    .setFooter({
      text: "banner by @1041uuu on tumblr",
    })
    .setImage(
      `https://64.media.tumblr.com/aa05fe3b460d3dd0b4324a12f423ec72/c6c80f2198878c5f-18/s540x810/3ad5dbf237149e13e763f9ec9013e3306d918a6b.gif`,
    );

  return embed;
}

async function getCharacterRulesTwoEmbed() {
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
      text: "banner by @1041uuu on tumblr",
    });

  return embed;
}

async function getRolesOneEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`➴　　┈　　🔴　　𝐏𝐑𝐎𝐍𝐎𝐔𝐍𝐒`)
    .setColor("#d16f6f")
    .setDescription(
      `**　　**◌　　⏖　　ꜜ🍒　　<@&1534457442698661939>
　　◌　　⏖　　ꜜ🍁　　<@&1534457486625607760>
　　◌　　⏖　　ꜜ🍓　　<@&1534457524798095441>
　　◌　　⏖　　ꜜ🍷　　<@&1534457591105716344>
　　◌　　⏖　　ꜜ🏮　　<@&1534457630494294087>`,
    )
    .setImage(
      "https://i.pinimg.com/originals/b2/2a/a2/b22aa22b2f3f55b6468361158d52e2e7.gif",
    )
    .setFooter({
      text: "banner by @1041uuu on tumblr",
    });

  return embed;
}

async function getRolesTwoEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`➴　　┈　　🟠　　𝐀𝐆𝐄`)
    .setColor("#d19e6f")
    .setDescription(
      `**　　**◌　　⏖　　ꜜ🍹　　<@&1534457967779250277>
　　◌　　⏖　　ꜜ🍊　　<@&1534457994295906327>`,
    )
    .setImage(
      "https://i.pinimg.com/originals/bf/be/dc/bfbedce4a9c3ff9169faa5744634985f.gif",
    )
    .setFooter({
      text: "banner by @minimoss on tumblr",
    });

  return embed;
}

async function getRolesThreeEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`➴　　┈　　🟡　　𝐏𝐈𝐍𝐆 𝐏𝐑𝐄𝐅𝐄𝐑𝐄𝐍𝐂𝐄𝐒`)
    .setColor("#d1cb6f")
    .setDescription(
      `**　　**◌　　⏖　　ꜜ☀️　　<@&1534460070635769936>
　　◌　　⏖　　ꜜ🐝　　<@&1534460189518856332>
　　◌　　⏖　　ꜜ🐥　　<@&1534460232024195143>`,
    )
    .setImage(
      "https://i.pinimg.com/originals/26/45/47/2645475a9eef90f4a1fe67b76ae7d9fa.gif",
    )
    .setFooter({
      text: "banner by @kirokaze on deviantart",
    });

  return embed;
}

async function getRolesFourEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`➴　　┈　　🟢　　𝐃𝐌 𝐏𝐑𝐄𝐅𝐄𝐑𝐄𝐍𝐂𝐄𝐒`)
    .setColor("#83d16f")
    .setDescription(
      `**　　**◌　　⏖　　ꜜ🍵　　<@&1534460372675858544>
　　◌　　⏖　　ꜜ🍃　　<@&1534460455534334003>
　　◌　　⏖　　ꜜ🧩　　<@&1534460500174442576>`,
    )
    .setImage(
      "https://i.pinimg.com/originals/39/7e/f3/397ef3b50d7e3e6c289e53b0c95a0b0b.gif",
    )
    .setFooter({
      text: "banner by motocross saito on artstation",
    });

  return embed;
}

async function getRolesFiveEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`➴　　┈　　🔵　　𝐖𝐑𝐈𝐓𝐈𝐍𝐆 𝐏𝐑𝐄𝐅𝐄𝐑𝐄𝐍𝐂𝐄𝐒`)
    .setColor("#6fd1d1")
    .setDescription(
      `**　　**◌　　⏖　　ꜜ🐟　　<@&1534456980993998848>
　　◌　　⏖　　ꜜ🐬　　<@&1534457025768194169>
　　◌　　⏖　　ꜜ🌊　　<@&1534457061210066994>
　　◌　　⏖　　ꜜ🌀　　<@&1534457107628163082>`,
    )
    .setImage(
      "https://i.pinimg.com/originals/ff/a9/6e/ffa96ede4039820cdac1185df70b8dc7.gif",
    )
    .setFooter({
      text: "banner by @1041uuu on tumblr",
    });

  return embed;
}

async function getRolesSixEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`➴　　┈　　🟣　　𝐀𝐃𝐃𝐈𝐓𝐈𝐎𝐍𝐀𝐋 𝐏𝐈𝐍𝐆𝐒`)
    .setColor("#a56fd1")
    .setDescription(
      `**　　**◌　　⏖　　ꜜ🍇　　<@&1534631480373018655>
　　◌　　⏖　　ꜜ👾　　<@&1534631563906777099>
　　◌　　⏖　　ꜜ🔮　　<@&1534631736124772586>
　　◌　　⏖　　ꜜ☂️　　<@&1534631779061727412>
　　◌　　⏖　　ꜜ💜　　<@&1539913483653746748>`,
    )
    .setImage(
      "https://i.pinimg.com/originals/56/3a/b1/563ab15230f5bf4259f11125fd1f9c0e.gif",
    )
    .setFooter({
      text: "banner by ao85 on artstation",
    });

  return embed;
}

async function getFaqOneEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐅𝐑𝐄𝐐𝐔𝐄𝐍𝐓𝐋𝐘 𝐀𝐒𝐊𝐄𝐃 𝐐𝐔𝐄𝐒𝐓𝐈𝐎𝐍𝐒`)
    .setColor("#bda1be")
    .setDescription(
      `If you need more clarification or answers to a question that isn't on this list, feel free to ask about it in <#1527299700699566162>!`,
    )
    .setImage(
      "https://i.pinimg.com/originals/5f/f4/58/5ff45883d083027e28142ce6fc48659d.gif",
    )
    .setFooter({
      text: "banner by valenberg on deviantart",
    });

  return embed;
}

async function getFaqTwoEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`﹒﹒Server Questions !!`)
    .setColor("#635e83")
    .setDescription(
      `OO1 ﹕Can I invite a friend?
> Of course! The more, the merrier. Giving staff a head's up beforehand would be appreciated, though, especially if you're inviting multiple people.

OO2 ﹒﹒Can I get a color role?
> While we would like to avoid excessive role clutter in the server, you can gain a custom color role through boosting the server.
 
OO3 ﹕How can I create a partnership with this server?
> Go to <#1533686056019300452> and create a ticket! Please do not DM staff for partnerships.
 
OO4 ﹒﹒Can I help answer questions that others ask in <#1527299700699566162>?
> If it is a question that can be answered by directly forwarding/screenshotting a section of the rules or one of the staff's rulings on such a question, then feel free to do so! However, to avoid confusion, we ask that personal interpretations of the rules are not shared as it can lead to minimodding or misinformation.
`,
    )
    .setImage(
      "https://i.pinimg.com/originals/9f/0d/ae/9f0dae7c8678a5b18b8bbfbf924d8392.gif",
    )
    .setFooter({
      text: "banner by @ilta222 on tumblr",
    });

  return embed;
}

async function getFaqThreeEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`﹒﹒Character Questions !!`)
    .setColor("#504b6b")
    .setDescription(
      `OO1 ﹕Where's the template? How do I submit my character?
> The template for OCs can be found in <#1531841416865648841>. Submit your oc with **/submit character**.

OO2 ﹒﹒How many OCs can I make?
> You can make three OCs total, though they have to be in different classes.

OO3 ﹕How long will it be until my submission is reviewed?
> The time varies, but typically we'll get to it within a week. Please understand that staff do have their own lives outside of this server, but if you feel that your submission has been entirely forgotten about, feel free to politely (not demand or guilttrip) bring it up in your review thread.

OO4 ﹒﹒Can I use other templates or modify the existing one?
> As long as you have **all** of the mandatory sections on our template, yes!

OO5 ﹕Do I need a photo for my character?
> No, though if you do not use a photo, written description is required. Keep in mind that we require artist permission and do not allow faceclaims.

OO6 ﹒﹒Why do you guys not allow faceclaims?
> To encourage originality! We want to see characters that are made by **you**, not someone else's OC ripped off of Pinterest.
 
OO7 ﹕Can my character be a Psychic or an Aura Guardian?
> Psychic is allowed, but it would be extremely limited to the point of only minor telekinesis. Mind reading or telepathy would not be allowed. Aura Guardians are not allowed entirely.

OO8 ﹒﹒Do regional forms count as different evolutionary destinations?
> Yes! So long as the form cannot be changed, it would be considered separate.

OO7 ﹕Can my character's partner be Shiny or Alpha? 
> Shiny and Alpha status is decided at submission by a d20 dice roll.

OO8 ﹒﹒If an evolution chain includes a baby pokemon, can I start by skipping that stage?
> No. If you were to claim a Pikachu, you would start off with a Pichu. All evolutions start off at the very base of the chain.

OO9 ﹕Can I create a character from another region?
> Yes, but the one pokemon per character rule is considered universal in this server. Large-scale events such as evil team takeovers or legendary sightings are not considered canon in this universe.

`,
    )
    .setImage(
      "https://cdn.discordapp.com/attachments/797711998926323752/1539069483891691590/6.29.2017fireflylakeych-ezgif.com-resize.gif?ex=6a84f9a7&is=6a83a827&hm=51bd0617edba40444b5308a68bd4ccd5171b21c5647b3169d4ddd50f09e267d5&",
    )
    .setFooter({
      text: "banner by sqd on pixeljoint",
    });

  return embed;
}

async function getFaqFourEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`﹒﹒Roleplay Questions !!`)
    .setColor("#785d8a")
    .setDescription(
      `OO1 ﹕Can I NPC a character?
> You can use NPCs for interactions that call for them (ie. a waiter at a restaurant bringing your character a meal, a librarian checking out books for your character, your OC's family), however these NPCs cannot be used on their own in separate interactions apart from with their relevant OC.

OO2 ﹕When can my Pokemon evolve?
> While there are many methods to evolving pokemon, in this server, they will scale off of your badge account. If their evolution chain has three stages, then they can evolve at badge 2 and 4. If their evolution chain has two, then they can evolve at badge 3.

OO3 ﹒﹒How are Z-Moves, Mega Evolution, Terastalization, Gigantamaxxing, and/or other battle mechanics being handled?
> While most of the details are entirely unknown or mythologized in-character, attending events could potentially (but are not always guaranteed to) get you something related to those mechanics later down the line!

OO4 ﹕Can I have some variation in my Pokemon to make them distinct from the base species?
> It depends on how large the variation may be. A slight shift in color or markings could work, like how May's Bulbasaur in the anime has heart markings instead of the traditional triangle markings. However, enough variations to make it mistakable for a shiny form or for a regional form is not allowed. Feel free to check with Staff first just to make sure it's alright!

OO5 ﹒﹒Do people eat Pokemon or animals?
> There are no regular animals. People eat Pokemon products like Wishiwashi Sashimi and Tauros Steaks all the time! Many people opt to consume the more renewable sources of meat, like naturally detatched Slowpoke Tails or Blissey Eggs, though.`,
    )
    .setImage("https://pbs.twimg.com/media/E-97E1hUYAAgmkc.png?name=orig")
    .setFooter({
      text: "banner by @mattfdraws on twitter",
    });

  return embed;
}

async function getLoreHistoryEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐇𝐈𝐒𝐓𝐎𝐑𝐘`)
    .setColor("#ee98c1")
    .setDescription(
      `In the distant past, long before the region of Sanyuan had a name, a great uprising had bloodied its ancient lands.

Perhaps it was because of the overcrowded and neglected; trainers catching Pokemon that they simply could not take care of—or, perhaps it was the abused, suffering from those in power forcing their Pokemon to commit deeds of evil. Regardless, it was the mistreatment of Pokemon that shifted the tides into one of war—an Uprising strong enough to shatter the norm.

It was a messy conflict, one that left families bereft of children and parents on both sides. Humans were powerless before the might of Pokemon, but their ingenuity kept them three steps ahead as they forced Pokemon to fight against their own kind. During those times, it was so bleak that the only future each side could imagine was one where the other was eradicated entirely.

When all hope seemed lost, three mythical Pokemon descended from the skies—bringing unity to the lands.

Thanks to the intervention of Victini, Jirachi, and Mew, the war slowed to a stop, and negotiations began. Some argued for the complete separation of humans and pokemon, while others argued for the status quo to be continued and for the uproar to be disregarded and forgotten.

In the end, humans and Pokemon came to a compromise.

There would no longer be trainers with full teams of pokemon, but rather: one Pokemon, if at all. It was decided that this would prevent the abuse of power humans had held over their supposed companions for so long, allowing humans to develop and truly bond with their chosen Partner.

While most of the precise historical details have been lost to time, that is the legends for how the one-on-one partnerships between Humans and Pokemon have begun.

As people began adjusting to this new way of life, so did society. It wasn’t as if Pokemon were prohibited from hanging out with Trainers who already had a partner Pokemon—they were simply unable to be caught, remaining wild Pokemon on their own terms.

Regulations began springing up, from the restriction of Pokeball sales to the decision on who could receive official Pokemon Partners entirely. Eventually, it was decided that all trainers would require a formal education—not only to avoid repeating the atrocities of the past and teach them how to properly care for their Pokemon partner’s needs, but also to prepare them for the real world.

That is the origin of Dexlight Academy, the starting place for all trainers.`,
    )
    .setImage(
      "https://64.media.tumblr.com/feceffc1039c6e37583700ca47730407/4127768b7eafaf67-9d/s1280x1920/635c02ff3664cee5be9504b26d3c549de3c953e3.gif",
    )
    .setFooter({
      text: `banner by @apolism on tumblr`,
    });
  return embed;
}

async function getLoreDexlightAcademyEmbed(): Promise<EmbedBuilder[]> {
  const embed = new EmbedBuilder()
    .setTitle(`𝐇𝐎𝐔𝐒𝐄𝐒`)
    .setColor("#6be26b")
    .setDescription(
      `Accepting students as young as 16 with no upper limit, Dexlight Academy is a school for anyone and everyone with potential. There are three houses, each named in honor of the Mythicals of Peace:`,
    )
    .setImage(
      "https://i.pinimg.com/originals/d0/c2/2e/d0c22e043a90d7037af552ef4fe54235.gif",
    )
    .setFooter({
      text: `banner by @apolism on tumblr`,
    });
  const embed2 = new EmbedBuilder()
    .setTitle(`𝐕𝐈𝐂𝐓𝐈𝐍𝐈`)
    .setColor("#ce1b1b")
    .setDescription(
      `> For the greatest wills. Victini's house is home to the battlers, those who are ready to feel clashing passions and the heat of battle. Battling is part of a Pokemon’s base instincts, and like the ancient trainers from before, the trainers in this class enjoy partaking in gritty combat. Their graduates are often the first responders in the case of rampaging Pokemon, and partake in keeping the public safety.`,
    )
    .setImage(
      "https://64.media.tumblr.com/4c989428ba947bc4966e07e76d36bd28/118ec01107834a73-07/s540x810/5c2aa6ffdba2c64d3deb6fb0a646313eb247c561.gif",
    )
    .setFooter({
      text: `banner by @waneella on tumblr`,
    });

  const embed3 = new EmbedBuilder()
    .setTitle(`𝐌𝐄𝐖`)
    .setColor("#3473fa")
    .setDescription(
      `> For the sharpest minds. The Mew house is one focused purely on study, whether it’s Pokemon biology or technology. Graduates from this house often go into scientific fields, and the most useful of inventions—whether it’s Nurse Joy’s technology or the battle items that you might use today—can be attributed to them.`,
    )
    .setImage(
      "https://i.pinimg.com/originals/33/00/37/330037e99d9692d6b6a290296a33bdca.gif",
    )
    .setFooter({
      text: `banner by @1041uuu on tumblr`,
    });

  const embed4 = new EmbedBuilder()
    .setTitle(`𝐉𝐈𝐑𝐀𝐂𝐇𝐈`)
    .setColor("#FFC969")
    .setDescription(
      `> For the most passionate hearts. The house of Jirachi is meant for those who seek to bond with Pokemon of all kinds, not just their partner. Their graduates often take occupations in the same vein working with all sorts of Pokemon, such as Pokemon Breeders and Nurses.`,
    )
    .setImage(
      "https://i.pinimg.com/originals/82/19/ad/8219adaa7148d1dcd477a4d728f97b85.gif",
    )
    .setFooter({
      text: ` banner by @anasabdin on tumblr`,
    });

  return [embed, embed2, embed3, embed4];
}

async function getLoreTrialCircuitEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐓𝐑𝐈𝐀𝐋𝐒`)
    .setColor("#b3df8a")
    .setDescription(
      `Compared to the traditional approach of a non-trainer school, Dexlight Academy offers a more hands-on experience, looking to combine both the grand stories of the ancient trainer’s adventures with the journey that comes with learning. Instead of 'book' learning with your teachers, students of Dexlight Academy participate in a Trial Circuit in order to receive official certification and graduation from their courses.

With 18 total Sanyuanese Trial Leaders (listed in <#1540209862489939999>), there are 6 assigned to each class. As a student of Dexlight Academy, you are only expected to complete the 6 trials within your class, before completing a seventh with your respective class’s Champion.

For some, it only takes one year to complete the Circuit. For others, decades.

These Trials are seen as a rite of passage—you can only rely on yourself and your partner. Not much is publicly known about them, and the ones who have experienced these Trials remain tight-lipped on the matter. Some can even pass trials without even knowing it—sometimes the Trial Leaders grant their badges outside of their Trials to those who they feel already have learned the lesson they impart.

Regardless of your class, however, the Trial Circuit does not discourage you from traveling together with your friends. This is a time to grow, to create new bonds.

But while you may encounter difficulties on your journey, do not remain discouraged. Dexlight Academy selects its students for a reason: the pure potential the Champions have seen in you.`,
    )
    .setImage(
      "https://i.pinimg.com/1200x/97/83/e4/9783e455c0b262277955766f9c7923ac.jpg",
    )
    .setFooter({
      text: `banner by @1041uuu on tumblr`,
    });

  return embed;
}

async function getLoreRegionMap() {
  const embed = new EmbedBuilder()
    .setTitle(`thank you so much!!`)
    .setColor("#53bd7f")
    .setDescription(`WIP`)
    .setImage(
      "https://i.pinimg.com/originals/05/6d/8a/056d8a102432ffe13476a0b783c5116d.gif",
    )
    .setFooter({
      text: `banner by @setamo-arts on tumblr`,
    });

  return embed;
}

export async function getVerifyEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍`)
    .setColor("#9dcac0")
    .setDescription(
      `read the <#${process.env.SERVER_RULES_CHANNEL}> to find the password! then, send the password in here (as one word) to be verified.
      
need a hint? 
-# ||it's in the rule that mentions staff safety||.
`,
    )
    .setImage(
      "https://i.pinimg.com/originals/b2/2a/a2/b22aa22b2f3f55b6468361158d52e2e7.gif",
    )
    .setFooter({
      text: "banner by @1041uuu on tumblr",
    });

  return embed;
}

export async function getPartnershipRulesEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐏𝐀𝐑𝐓𝐍𝐄𝐑𝐒𝐇𝐈𝐏 𝐑𝐔𝐋𝐄𝐒`)
    .setColor("#638b92")
    .setDescription(
      `We'd love to partner with servers who follow these rules:
1. Friendly Environment.
> Cannot be racist, homophobic, transphobic, ableist, etc.
2. No Slurs.
> Self-explanatory. Server must have a rule against slurs.
3. No NSFW.
> No NSFW content, whether in visual or auditory form, is allowed.
4. Keep our ad up.
> You must keep our advertisement up as long as the partnership lasts. If it is taken down or the ambassador representing the server leaves, then the partnership is considered over!

Please create a ticket in <#1533686056019300452> with the keyword **\`moonshine\`** (to prove you have read these rules) if you're interested in a partnership! Please do not DM staff or server members. We will ping <@&1539913483653746748> for partnership announcements!`,
    )
    .setImage(
      "https://cdna.artstation.com/p/assets/images/images/056/215/680/original/ryan-haight-eastlake-hway-large.gif?1668708925",
    )
    .setFooter({
      text: "banner by ryan haight on artstation",
    });

  return embed;
}

export async function getResourcesEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐑𝐄𝐒𝐎𝐔𝐑𝐂𝐄𝐒`)
    .setColor("#9b3a36")
    .setDescription(
      `Please know that you are not alone! Here are some helpful resources that we’ve gathered below to help you! If there are any other links you believe we should include, feel free to let us know so we can add them.

[International Suicide Hotlines](<https://blog.opencounseling.com/suicide-hotlines/>)
> A list of hotlines for different countries, including emergency numbers and in-person counseling options.

[Mental Health Resources](<https://wellbeingtrust.org/mental-health-resources/>)
> A list of resources that can be filtered by need or case, such as depression, anxiety, stress, etc.

[Mental Health Resources for People of Color](<https://www.onlinemswprograms.com/resources/mental-health-resources-racial-ethnic-groups/>)
> A collection of organizations, directories, and resources aimed at helping and focusing on the needs of people of color and marginalized groups. Both nationwide and virtual options are available, providing services that aim to acknowledge and understand different lived realities.

[Mental and Substance Use Disorder Treatment](<https://findtreatment.gov/>)
> This is a confidential and anonymous resource for those seeking treatment for mental and substance use disorders in the US and its territories. Alternatively, you can connect with SAMHSA's National Helpline by calling 1-800-662-HELP (4357).

[LGBTQ+ Resource Library](<https://www.thementalhealthcoalition.org/resource-library/?resources_category=lgbtq>)
> A database filtered to help learn about mental health, help loved ones, learn coping skills, and ways to seek support near you.`,
    )
    .setImage(
      "https://i.pinimg.com/originals/43/93/8a/43938a18ca65b8dca70abd0bada8e1ec.gif",
    )
    .setFooter({
      text: "banner by @waneella on tumblr",
    });

  return embed;
}

export async function getTemplateEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐓𝐄𝐌𝐏𝐋𝐀𝐓𝐄`)
    .setColor("#83c79d")
    .setDescription(
      `Submissions require two reviewer's go-ahead to be approved! This is to make sure we're thorough with the reviewer process. Staff is not exempt from this rule for personal characters.

**Google Docs**
> https://docs.google.com/document/d/1YdzP9YNijiAENToGsy2p_EMaYGcozV6Mz0PPuPdWDuY/edit
To make a copy, go to **File > Make a copy**!

**Ellipsus (Alternative to Google Docs)**
> https://ellipsus.com/read/33JEXtRO9qpwLR6yNTLHLY/Dexlight-Academy-Template
To make a copy, simply copy all of it and then paste into your own ellipsus document!

-# You're welcome to edit the documents however you like, but please do not change the credits!`,
    )
    .setImage(
      "https://i.pinimg.com/originals/21/e2/8f/21e28fc14365924f2e4b46ef56fe3f7a.gif",
    )
    .setFooter({
      text: "banner by soterio-px on tumblr",
    });

  return embed;
}

async function getStaffNpcEmbed() {
  const embed = new EmbedBuilder()
    .setTitle(`𝐒𝐓𝐎𝐑𝐘 𝐍𝐏𝐂𝐒`)
    .setColor("#535a75")
    .setDescription(
      `Only story/event planners and event hosters are able to make [**Story NPCs**]. While they do not take up an OC slot, they are not a way to bypass the extra character rules! These are created for the express purpose of helping the story along, and as such, they cannot be used outside of events where they're supposed to be there.`,
    )
    .setImage(
      "https://i.pinimg.com/1200x/d1/a8/59/d1a859d7445b6e46e5f1a407c3114ec1.jpg",
    )
    .setFooter({
      text: `banner by @waneella on tumblr`,
    });

  return embed;
}

async function getPostVerifyEmbed(client: Client, user: string) {
  const person = await client.users.fetch(user);

  const embed = new EmbedBuilder()
    .setTitle(`a new trainer has passed their entrance exams!`)
    .setColor("#288191")
    .setDescription(
      `Right this way, <@${user}>! Feel free to look take a look around! Be sure to make a <#1527299754143518891> and pick up some <#1527211403805724784>.

Don't be afraid to say hi, and feel free to ask us about anything in <#1527299700699566162>!`,
    )
    .setImage(
      "https://i.pinimg.com/originals/8a/c0/64/8ac0643083af56becf469929d8a7df72.gif",
    )
    .setFooter({
      text: `welcome, ${person.username}! | banner by @setamo-arts on tumblr`,
    });

  return embed;
}

async function getJoinEmbed(client: Client, user: string) {
  const person = await client.users.fetch(user);
  const avatar = person.displayAvatarURL({ size: 1024 });

  const embed = new EmbedBuilder()
    .setTitle(`a new arrival has enrolled in the academy!`)
    .setColor("#d1c488")
    .setDescription(
      `Hey there, <@${user}>! Welcome to the server!

Before you jump in, please read over everything under the <#1527209676985471081>. Then, head over to <#1533778121889808485> to get yourself checked in.

We hope you enjoy your stay here!`,
    )
    .setImage(
      "https://i.pinimg.com/originals/8e/c6/f1/8ec6f1630c1f40394878290b96c74e6f.gif",
    )
    .setFooter({
      text: `${person.username} landed! | banner by @tofupixel on bluesky`,
    })
    .setThumbnail(avatar);

  return embed;
}

async function getLeaveEmbed(client: Client, user: string) {
  const person = await client.users.fetch(user);
  const avatar = person.displayAvatarURL({ size: 1024 });

  const embed = new EmbedBuilder()
    .setTitle(`oh no!`)
    .setColor("#393b42")
    .setDescription(
      `It seems <@${user}> didn't quite have the passion for being a trainer like we thought... so long, <@${user}>! We hope you enjoyed your time here.`,
    )
    .setImage(
      "https://i.pinimg.com/originals/84/ae/ae/84aeaec6b6e64730b07610a8474022ca.gif",
    )
    .setFooter({
      text: `${person.username} left! | banner by @motocross_saito on tumblr`,
    })
    .setThumbnail(avatar);

  return embed;
}

async function getBirthdayEmbed(client: Client, user: string) {
  const person = await client.users.fetch(user);
  const avatar = person.displayAvatarURL({ size: 1024 });

  const embed = new EmbedBuilder()
    .setTitle(`happy birthday!!`)
    .setColor("#73dbee")
    .setDescription(
      `Hey, looks like it's <@${user}>'s special day! Thanks for sticking with us so far—here's to hoping that your next year will be just as good, if not better!`,
    )
    .setImage(
      "https://i.pinimg.com/originals/59/29/7e/59297e294dd62f3103ddc9fd4ba09cb2.gif",
    )
    .setFooter({
      text: `it's ${person.username}'s birthday! | banner by @minimoss on twitter`,
    })
    .setThumbnail(avatar);

  return embed;
}

async function getCharaBdayEmbed(
  avatar: string | undefined,
  artist_credits: string | undefined,
  name: string,
  user: string,
) {
  const embed = new EmbedBuilder()
    .setTitle(`Oh? Looks like it’s a special day today!`)
    .setColor("#73dbee")
    .setDescription(
      `Give your birthday wishes to ${name}, written by <@${user}>! Hope you receive wonderful presents (though please do not ask us for a passing grade in a class you might be failing), and here’s to another great year!`,
    )
    .setImage(
      avatar ??
        `https://i.pinimg.com/originals/59/29/7e/59297e294dd62f3103ddc9fd4ba09cb2.gif`,
    )
    .setFooter({
      text: `it's ${name}'s birthday! | ${artist_credits ?? `banner by @minimoss on twitter`}`,
    });
  //.setThumbnail();

  return embed;
}

async function getBoostEmbed(client: Client, user: string) {
  const person = await client.users.fetch(user);
  const avatar = person.displayAvatarURL({ size: 1024 });
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);

  const embed = new EmbedBuilder()
    .setTitle(`thank you so much!!`)
    .setColor("#ae281c")
    .setDescription(
      `We appreciate the support, <@${user}>! You've unlocked the following perks:
- The monthly ability to reroll minor characteristics of your partner pokemon three times (both OOC and IRP)!
> -# **/booster reroll**
- A custom color role using hexcodes!
> -# **/booster role**
With your contribution, we are now at ${guild?.premiumSubscriptionCount} server boost(s)!`,
    )
    .setImage(
      "https://preview.redd.it/torii-to-another-time-me-pixel-art-2020-v0-zhgjmedjwii41.png?width=1080&crop=smart&auto=webp&s=e6a5e71970245ae20ee34eea290c189ab9bc9cbc",
    )
    .setFooter({
      text: `${person.username} boosted! | banner by @16pxl on twitter`,
    })
    .setThumbnail(avatar);

  return embed;
}
