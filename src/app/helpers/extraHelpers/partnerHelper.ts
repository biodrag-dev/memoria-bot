import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "@discordjs/builders";
import * as characterHelper from "../characterHelper";
import * as pokeHelper from "../pokeHelper";

import { OocPartner } from "../characterHelper";
import { ButtonStyle, ColorResolvable, resolveColor } from "discord.js";

export const sessions = new Map<string, choices>();

export interface professorInfo {
  starter1: partnerProspect;
  starter2: partnerProspect;
  starter3: partnerProspect;
}

export interface choices {
  starter1: partnerProspect;
  starter2: partnerProspect;
  starter3: partnerProspect;
}

export interface partnerProspect {
  sizeMult: number;
  gender: string;
  ability: number;
  species: string;
  shiny: boolean;
  nature: string;
}

export const professors: ProfessorData[] = [
  {
    name: `Anrui Tian`,
    icon: `https://cdn.tupperbox.app/pfp/1074503972037075054/ZK_qZn6bS8-ym7jd.webp`,
    thumbnail: `https://cdn.tupperbox.app/pfp/1074503972037075054/ZK_qZn6bS8-ym7jd.webp`,
    hexcode: "#910b0b",
    friendship: {
      none: `Hey... You should treat PARTNER better. It seems like they don't really like how it's goin' right now.`,
      wary: `PARTNER is pretty wary of you, so maybe you should change it up a lil'. Spend more time around 'em, play with 'em, you know the deal.`,
      neutral: `Looks like PARTNER'll take some time to warm up to ya. Keep tryin', and you'll get it eventually, yeah?`,
      low: `Hey, looks PARTNER's started to warm up to ya! I'm sure you'll be best friends in no time.`,
      medium: `Oh, hey there, PARTNER! I see they've gotten quite friendly towards you now!`,
      high: `You two sure get along great! That bond of trust between you and PARTNER... it's really cool to see!`,
      highest: `Woah... You and PARTNER are the best of friends, huh? I'm totally jealous!`,
    },
    starter_title: `Hey there, it looks like you don't have a partner yet!`,
    starter_dialogue: `Why don't we help you find one? Let's see... where did I put that assessment?    
...
Oh, there we go! 

Okay, so a couple things to keep in mind before we begin...
> You can retake this assessment as many times as you'd like!
> However, you can't change your starter once you pick 'em up.
> There's a chance of shiny or alpha-sized pokemon, so you might wanna take your time searchin'!
> 'Course, if you boost later, you could always reroll the shiny status or size! Though it's not really the same, y'know?
Alrighty, as soon as you sign on the dotted line right there, we'll find you one in no time! C'mon!`,
  },
  {
    name: `Liyuan Yin`,
    icon: `https://i.ibb.co/mrZnDm3F/FBD20-B6-E-D3-D3-47-F7-B0-FA-14-F87355-FFD3.png`,
    thumbnail: `https://i.ibb.co/mrZnDm3F/FBD20-B6-E-D3-D3-47-F7-B0-FA-14-F87355-FFD3.png`,
    hexcode: "#48CAE4",
    friendship: {
      none: `WHAT!? …What’re you trying to do with PARTNER? They don’t seem to like you at all!`,
      wary: `Huh. Seems like PARTNER is a bit wary of you. Try spending more time with them! Get to know them! Stuff like that!`,
      neutral: `Hey! Looks like you guys are getting acquainted! PARTNER still needs to warm up a bit, but you’ll get there!`,
      low: `PARTNER’s warming up to you! Can’t wait to see where this friendship goes!`,
      medium: `Awww, looks like PARTNER’s warmed up to you!!`,
      high: `Heyyy! Seems like you guys have become pretty good friends! That’s the cutest ever!`,
      highest: `WHAT!!! You and PARTNER are basically BEST FRIENDS FOREVER! …So awesome…`,
    },
    starter_title: `Hey! You don’t have a partner yet!?`,
    starter_dialogue: `Hold on — let’s get you an assessment…!
…
Here — take this!

Now, before you take this awesome test, there are a couple of things you gotta keep in mind!
> If you didn’t like how you answered, you can retake the assessment however many times you want!
> Once you choose your starter, you can’t change them! That’d be plain mean!!
> You might find a shiny or an alpha ‘mon, so take your time looking!
> Psst… there’s also this thing called boosting… if you boost, you could always reroll for shiny status or size if you don’t get it the first time!
Got that? Great! Awesome! Amazing! Get over here and step riiiight up, and we’ll find you your partner!`,
  },
  {
    name: `Ruyi Qiu`,
    icon: `https://images-ext-1.discordapp.net/external/2MMTHH-zunL_AXgfkywXqE4Wm0rpjIAa0_UruDmFPVc/https/cdn.tupperbox.app/pfp/350614938722500608/zDaEkqyi8BQqitv8.webp?format=webp`,
    thumbnail: `https://images-ext-1.discordapp.net/external/2MMTHH-zunL_AXgfkywXqE4Wm0rpjIAa0_UruDmFPVc/https/cdn.tupperbox.app/pfp/350614938722500608/zDaEkqyi8BQqitv8.webp?format=webp`,
    hexcode: "#ffe998",
    friendship: {
      none: `Oh dear… On the bright side, you and your companion are still together, but even that seems like nothing short of a miracle. Please take care of PARTNER and spend more time with them, we wouldn’t want them to run away, right?`,
      wary: `Looks like PARTNER is still wary of you, hm? No need to worry, bonds can’t be forced but they can improve as you two create more memories together!`,
      neutral: `I give you a passing mark, I suppose. PARTNER isn’t ready to open up to you yet, but don’t rush it. Coexistence is good too, don’t you think?`,
      low: `The first hurdle is oftentimes the most difficult, but you've done well in getting PARTNER to warm up to you a little. I have no doubt that the two of you will continue to reach greater heights.`,
      medium: `My, you've come a long way! You and PARTNER are on friendly terms now. I can't say I'm not a little surprised, seeing where the two of you started out.`,
      high: `Your bond with PARTNER is quite envious, I must admit. The two of you have an unspoken connection that will carry you both great lengths. Lifelong companions, truly.`,
      highest: `Hah, I have a feeling you and PARTNER don't need my opinion. Just look at you two, souls that have essentially bound themselves together no matter what challenges come your way.`,
    },
    starter_title: `Oh? It seems you don't have a partner yet.`,
    starter_dialogue: `Well, let's not waste our breath stating the obvious.   
...
Here, take this assessment for me, will you?

But allow me to brief you on a few things first...
> Take this assessment as many times as you please, I won't judge.
> Choose wisely. Once your partner is set in stone, there's no changing it.
> It is possible to obtain Shiny and Alpha Pokémon, if those suit your tastes more.
> If you're feeling generous, a boost allows you to reroll their shiny status and size, even after you've locked in a decision.
But hearing it from me only does so much, wouldn't you say so too? Read the fine print before you sign and let's see what fate has in store for you.`,
  },
];

export interface ProfessorData {
  name: string;
  icon: string;
  thumbnail: string;
  hexcode: ColorResolvable;
  starter_title: string;
  starter_dialogue: string;
  friendship: friendshipQuotes;
}

export interface friendshipQuotes {
  none: string;
  wary: string;
  neutral: string;
  low: string;
  medium: string;
  high: string;
  highest: string;
}
const flavorNatures = [
  { value: `1`, likes: `none`, dislikes: `none` },
  { value: `2`, likes: `spicy`, dislikes: `sour` },
  { value: `3`, likes: `spicy`, dislikes: `dry` },
  { value: `4`, likes: `spicy`, dislikes: `bitter` },
  { value: `5`, likes: `spicy`, dislikes: `sweet` },

  { value: `6`, likes: `sour`, dislikes: `spicy` },
  { value: `7`, likes: `none`, dislikes: `none` },
  { value: `8`, likes: `sour`, dislikes: `dry` },
  { value: `9`, likes: `sour`, dislikes: `bitter` },
  { value: `10`, likes: `sour`, dislikes: `sweet` },

  { value: `11`, likes: `dry`, dislikes: `spicy` },
  { value: `12`, likes: `dry`, dislikes: `sour` },
  { value: `13`, likes: `none`, dislikes: `none` },
  { value: `14`, likes: `dry`, dislikes: `bitter` },
  { value: `15`, likes: `dry`, dislikes: `sweet` },

  { value: `16`, likes: `bitter`, dislikes: `spicy` },
  { value: `17`, likes: `bitter`, dislikes: `sour` },
  { value: `18`, likes: `bitter`, dislikes: `dry` },
  { value: `19`, likes: `none`, dislikes: `none` },
  { value: `20`, likes: `bitter`, dislikes: `sweet` },

  { value: `21`, likes: `sweet`, dislikes: `spicy` },
  { value: `22`, likes: `sweet`, dislikes: `sour` },
  { value: `23`, likes: `sweet`, dislikes: `dry` },
  { value: `24`, likes: `sweet`, dislikes: `bitter` },
  { value: `25`, likes: `none`, dislikes: `none` },
];

const flavors = [
  { value: `spicy`, name: `Cheri`, emoji: `1539734908832845864` },
  { value: `dry`, name: `Chesto`, emoji: `1539734908057034873` },
  { value: `sweet`, name: `Pecha`, emoji: `1539734907197325323` },
  { value: `bitter`, name: `Rawst`, emoji: `1539734906345885828` },
  { value: `sour`, name: `Aspear`, emoji: `1539734905494175836` },
  { value: `spicy`, name: `Figy`, emoji: `1539735274588733501` },
  { value: `dry`, name: `Wiki`, emoji: `1539735273393627207` },
  { value: `sweet`, name: `Mago`, emoji: `1539735272156303360` },
  { value: `bitter`, name: `Aguav`, emoji: `1539735270629314702` },
  { value: `sour`, name: `Iapapa`, emoji: `1539735269715222528` },
];

const dislikedFlavor = [
  `PARTNER spat out the berry with a vengeance! It didn't like the flavor...`,
  `Oh dear... it seems like PARTNER is moping about after eating that berry...`,
  `PARTNER is taking carefully measured nibbles of the berry. Doesn't seem like PARTNER liked that berry very much.`,
];

const okayFlavor = [
  `PARTNER munched on the berry. It was satisfactory!`,
  `PARTNER ate the berry. It's alright...`,
];

const lovedFlavor = [
  `PARTNER chowed down with gusto, barely stopping to breathe in between bites!`,
  `PARTNER nuzzled against your leg after eating that berry! Seems like they really liked it!`,
];

const prompts = [
  `PARTNER found something shiny at the park today and gave it to you, expecting to be praised!`,
  `PARTNER took a nap in the sun today. They're nice and toasty!`,
  `PARTNER had a little adventure and got covered in mud. It's all over the place!`,
  `PARTNER got really hungry and managed to find out where all the snacks are. Looks like more shopping's on the to-do list...`,
  `PARTNER found a beautiful flower and brought it to you!`,
  `PARTNER got scared by a spooky sound. They're huddling in your bed for comfort!`,
  `PARTNER missed you while you were away. They made a mess in the meantime!`,
  `PARTNER found a berry they really liked, but mustered up the generosity to share with you!`,
];

const playPrompts = [
  `PARTNER had a fun day at the park! They weren't ready to go home, though...`,
  `PARTNER got really excited when playtime started. A little too excited, though— they might've broken something in their eagerness to play...`,
  `PARTNER wanted to play with you all day, so they got a little too competitive during playtime!`,
  `PARTNER played with another Pokemon they met! Looks like they have a new friend!`,
  `PARTNER celebrated after finally beating you at a game.`,
  `PARTNER got sleepy after having so much fun, so they curled up next to you after playtime.`,
  `PARTNER went on a little adventure with you! They almost got lost, though thankfully they found you in the end.`,
  `PARTNER played until they could barely keep their eyes open. They rolled around in the grass and had a blast!`,
];

export async function getPartner(id: string) {
  return await getOOCPartner(id);
}

function getRandomProfessor(): ProfessorData {
  const rand = Math.floor(Math.random() * professors.length);
  return professors[rand]!;
}

export function getRandomPrompt(): number {
  const rand = Math.floor(Math.random() * prompts.length);
  return rand;
}

function getFriendshipLevel(professor: ProfessorData, friendship: number) {
  if (friendship <= 20) {
    return professor.friendship.none;
  } else if (friendship < 50) {
    return professor.friendship.wary;
  } else if (friendship < 100) {
    return professor.friendship.neutral;
  } else if (friendship < 150) {
    return professor.friendship.low;
  } else if (friendship < 200) {
    return professor.friendship.medium;
  } else if (friendship < 255) {
    return professor.friendship.high;
  }
  return professor.friendship.highest;
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

export async function deleteProspects(id: string) {
  sessions.delete(id);
}

export function isNewDate(date: Date): boolean {
  const lastDate = new Date(date);
  const currentDate = new Date();

  return lastDate.getDay() != currentDate.getDay();
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

export async function generateStartingEmbed(id: string) {
  const professor = getRandomProfessor();

  const embed = new EmbedBuilder();
  embed
    .setColor(resolveColor(professor.hexcode))
    .setTitle(professor.starter_title)
    .setDescription(professor.starter_dialogue)
    .setFooter({ text: `quiz taken and modified from pokemon reborn | feature inspired by bloom's twilight horizon` })
    .setThumbnail(professor.thumbnail);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`starter_select:${id}:begin`)
      .setLabel(`Let's go!`)
      .setStyle(ButtonStyle.Primary),
  );
  return {
    embeds: [embed],
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
    happiness: 55,
    prompt: getRandomPrompt(),
    reset: new Date(),
    canFeed: true,
    canPlay: true,
  };

  await setOOCPartner(id, partnerProspect);
}

export async function getPartnerProspectEmbed(
  prospect: partnerProspect,
): Promise<EmbedBuilder> {
  const alphaCheck = pokeHelper.getSize(prospect.sizeMult);
  const shinyCheck =
    prospect.shiny == true ? `<:shiny:1539739147001012234>` : ``;
  const species = `**Species** | ${pokeHelper.displayName(prospect.species)}`;

  const pokemon = await pokeHelper.findPokemon(prospect.species);
  const gender = `**Gender** | ${prospect.gender}\n`;
  const ability = `**Ability** | ${pokeHelper.getAbilityName(pokemon!, prospect.ability)}\n`;
  const nature = `**Nature** | ${characterHelper.getNatureFromValue(prospect.nature)}\n`;

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

export async function getPartnerEmbed(username: string, id: string) {
  const partner = await getOOCPartner(id);
  if (partner) {
    const professor = getRandomProfessor();
    const metOn = `**Met On** | <t:${Math.floor(new Date(partner.registeredOn).getTime() / 1000)}:D>\n`;
    const nick = partner.nickname ? `${partner.nickname} | ` : ``;
    const nickname =
      partner.nickname ?? pokeHelper.displayName(partner.species);
    const friendship = `"${getFriendshipLevel(professor, partner.happiness).replace("PARTNER", `${nickname}`)}"`;
    const species = `**Species** | ${pokeHelper.displayName(partner.species)}`;
    const alphaCheck = pokeHelper.getSize(partner.sizeMult);
    const shinyCheck =
      partner.shiny == true ? `<:shiny:1539739147001012234>` : ``;

    const pokemon = await pokeHelper.findPokemon(partner.species);
    const scaledHeight = pokemon!.height * partner.sizeMult;
    const scaledWeight = pokemon!.weight * Math.pow(partner.sizeMult, 3);
    const level = `**Level** | ${getLevelFromExp(partner.experience)}\n`;
    const height = `${(scaledHeight * 0.1).toFixed(1)} m | ${pokeHelper.cmToFeetConversion(scaledHeight * 10)}`;
    const weight = `${(scaledWeight * 0.1).toFixed(1)} kg | ${pokeHelper.kgToPounds(scaledWeight * 0.1)} lbs`;

    const gender = partner.gender ? `**Gender** | ${partner.gender}\n` : ``;
    const ability = partner.ability
      ? `**Ability** | ${pokeHelper.getAbilityName(pokemon!, partner.ability)}\n`
      : ``;
    const nature = partner.nature
      ? `**Nature** | ${characterHelper.getNatureFromValue(partner.nature)}\n`
      : ``;

    const color = await pokeHelper.getColor(pokemon!);
    const image = await pokeHelper.getSprite(
      partner.species,
      partner.gender,
      partner.shiny,
    );

    var feed = ``;
    var play = ``;
    var prompt = `${prompts[partner.prompt]!.replaceAll(`PARTNER`, nickname)}`;
    if (partner.canFeed === true) {
      feed = `\n> ${nickname} is looking a little hungry... why not **\`/partner feed\`** them?`;
    }
    if (partner.canPlay === true) {
      play = `\n> ${nickname} is bursting with energy! Let's burn it off with **\`/partner play\`**!`;
    }

    const embed = new EmbedBuilder();
    embed
      .setTitle(
        `${nick}${`${username}'s ${pokeHelper.displayName(partner.species)}`}`,
      )
      .setColor(resolveColor(color.hexcode))
      .setDescription(
        `${species} ${alphaCheck} ${shinyCheck}
${level}${gender}${ability}${nature}${metOn}-# ${color.bannerCreds!}
${prompt}${feed}${play}`,
      )
      .setFooter({
        text: friendship!,
        iconURL: professor.icon,
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

export async function generateFeedingPrompt(id: string) {
  const partner = await getOOCPartner(id);
  const embed = new EmbedBuilder();
  embed
    .setColor(resolveColor("#DBBC67"))
    .setTitle(`It's mealtime!`)
    .setDescription(
      `What will you feed ${partner?.nickname ?? pokeHelper.displayName(partner!.species)} today?`,
    )
    .setThumbnail(
      await pokeHelper.getSprite(
        partner!.species,
        partner!.gender,
        partner!.shiny,
      ),
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`starter_feeding:${id}`)
      .setPlaceholder(`select an option...`)
      .addOptions(
        flavors.map((option) => ({
          label: `${option.name} Berry`,
          value: option.name,
          emoji: {
            id: option.emoji,
            name: `berry_${option.name.toLowerCase()}`,
          },
        })),
      ),
  );

  return {
    embeds: [embed],
    components: [row],
    ephemeral: false,
  };
}

export async function feedBerry(id: string, berry: string) {
  const partner = await getOOCPartner(id);
  const flavor = flavors.find((flavor) => flavor.name === berry)!.value;
  const nature = flavorNatures.find(
    (nature) => nature.value === partner!.nature,
  );
  var baseValue = 1;
  var prompt;
  var color;
  if (nature?.dislikes === flavor) {
    baseValue -= 2;
    color = resolveColor("#443333");
    prompt = dislikedFlavor[Math.floor(Math.random() * dislikedFlavor.length)];
  } else if (nature?.likes === flavor) {
    baseValue++;
    color = resolveColor("#a5e76f");
    prompt = lovedFlavor[Math.floor(Math.random() * lovedFlavor.length)];
  } else {
    prompt = okayFlavor[Math.floor(Math.random() * okayFlavor.length)];
    color = resolveColor("#a07f39");
  }

  await fedPartner(id, baseValue);

  const embed = new EmbedBuilder();
  embed
    .setColor(color)
    .setTitle(`Munch munch munch...`)
    .setDescription(
      prompt!.replaceAll(
        "PARTNER",
        partner?.nickname ?? pokeHelper.displayName(partner!.species),
      ),
    )
    .setThumbnail(
      await pokeHelper.getSprite(
        partner!.species,
        partner!.gender,
        partner!.shiny,
      ),
    );

  return {
    embeds: [embed],
    components: [],
    ephemeral: false,
  };
}

export async function playTime(id: string) {
  const partner = await getOOCPartner(id);

  await playWithPartner(id);

  const prompt = playPrompts[Math.floor(Math.random() * playPrompts.length)];
  const embed = new EmbedBuilder();
  embed
    .setColor(resolveColor("#e0a593"))
    .setTitle(`What a day!`)
    .setDescription(
      prompt!.replaceAll(
        "PARTNER",
        partner?.nickname ?? pokeHelper.displayName(partner!.species),
      ),
    )
    .setThumbnail(
      await pokeHelper.getSprite(
        partner!.species,
        partner!.gender,
        partner!.shiny,
      ),
    );

  return {
    embeds: [embed],
    components: [],
    ephemeral: false,
  };
}




////////////////////////////////////////////////////////////////////////////////////////////////////////
//    PARTNER MONS
///////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getOOCPartner(
  id: string,
): Promise<OocPartner | undefined> {
  const charaDex = await characterHelper.getUsers();
  return charaDex[id]?.OocPartner;
}

export async function resetDailies(id: string, prompt: number) {
  const charaDex = await characterHelper.getUsers();
  charaDex[id]!.OocPartner!.canFeed = true;
  charaDex[id]!.OocPartner!.canPlay = true;
  charaDex[id]!.OocPartner!.reset = new Date();
  charaDex[id]!.OocPartner!.prompt = prompt;
    await characterHelper.saveUsersExternal(charaDex);
}

export async function setOOCPartner(id: string, partner: OocPartner) {
  const charaDex = await characterHelper.getUsers();

  if (!charaDex[id]) {
    charaDex[id] = { characters: {} };
  }
  charaDex[id]!.OocPartner = partner;
    await characterHelper.saveUsersExternal(charaDex);
}

export async function increasedLevel(
  id: string,
  exp: number,
): Promise<Boolean> {
  const charaDex = await characterHelper.getUsers();
  const oldLevel = Math.min(
    100,
    getLevelFromExp(charaDex[id]!.OocPartner!.experience),
  );
  const newLevel = Math.min(
    100,
    getLevelFromExp(charaDex[id]!.OocPartner!.experience + exp),
  );

  return oldLevel != newLevel;
}

function getLevelFromExp(exp: number): number {
  return Math.min(100, Math.max(Math.floor(Math.cbrt(exp)), 1));
}

export function daysSince(date: Date) {
  const today = new Date();
  const prevDate = new Date(date);
  const diffMs = today.getTime() - prevDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
export async function addExpToPartner(id: string, exp: number) {
  const charaDex = await characterHelper.getUsers();
  if (charaDex[id]?.OocPartner) {
    //does level increase?
    if (await increasedLevel(id, exp)) {
      charaDex[id].OocPartner.happiness++;
    }
    //decreases happiness if abandoned
    if (daysSince(charaDex[id].OocPartner.lastInteracted) != 0) {
      editHappiness(id, -daysSince(charaDex[id].OocPartner.lastInteracted));
    }
    charaDex[id].OocPartner.lastInteracted == new Date();
    charaDex[id].OocPartner.experience += exp;
    await characterHelper.saveUsersExternal(charaDex);
  }
}

export async function nextEvoLevelPartner(id: string): Promise<number> {
  const charaDex = await characterHelper.getUsers();
  const pokemon = await pokeHelper.findPokemon(
    charaDex[id]!.OocPartner!.species,
  );
  const evolutions = await pokeHelper.getDirectEvolutions(pokemon!);
  //if no possible evolutions/fully evolved
  if (evolutions.size == 0) {
    return -1;
  }
  const evoChain = await pokeHelper.getEvolutionPath(pokemon!.name);
  const evoIndex = evoChain.findIndex((evo) => evo === pokemon!.name);

  if (evoIndex == 0) {
    return 25;
  } else if (evoIndex == 1) {
    return 50;
  }

  //if no partner
  return 0;
}

export async function canEvoOOCPartner(id: string) {
  const charaDex = await characterHelper.getUsers();
  const evoLevel = await nextEvoLevelPartner(id);
  const embed = new EmbedBuilder();
  const partnerName =
    charaDex[id]!.OocPartner!.nickname ??
    pokeHelper.displayName(charaDex[id]!.OocPartner!.species);
  if (evoLevel > getLevelFromExp(charaDex[id]!.OocPartner!.experience)) {
    embed
      .setDescription(
        `You can't evolve ${partnerName} until they hit **level ${evoLevel}**!`,
      )
      .setTitle("Hold it!")
      .setColor(0xFF0000);
    return { embeds: [embed], ephemeral: true };
  } else if (evoLevel == -1) {
    embed
      .setDescription(
        `No further evolutions can be found! If this is a bug, go to <#1527299700699566162> for help!`,
      )
      .setTitle("Your partner is fully evolved!")
      .setColor(0x808080);
    return { embeds: [embed], ephemeral: true };
  } else {
    const pokemon = await pokeHelper.findPokemon(
      charaDex[id]!.OocPartner!.species,
    );
    const evolutions = await pokeHelper.getDirectEvolutions(pokemon!);

    embed
      .setTitle(`What?`)
      .setDescription(`${partnerName} is evolving!`)
      .setThumbnail(
        await pokeHelper.getSprite(
          charaDex[id]!.OocPartner!.species,
          charaDex[id]!.OocPartner!.gender,
          charaDex[id]!.OocPartner!.shiny,
        ),
      )
      .setColor(0xFFFFFF);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`starter_evolution:${id}`)
        .setPlaceholder(`select an evolution...`)
        .addOptions(
          Array.from(evolutions).map((option) => ({
            label: `${pokeHelper.displayName(option)}`,
            value: option,
          })),
        ),
    );
    return { embeds: [embed], components: [row], ephemeral: true };
  }
}

export async function changeSpecies(id: string, species: string) {
  const charaDex = await characterHelper.getUsers();
  charaDex[id]!.OocPartner!.species = species;
  await characterHelper.saveUsersExternal(charaDex);
  const embed = new EmbedBuilder();
  const partnerName =
    charaDex[id]!.OocPartner!.nickname ??
    pokeHelper.displayName(charaDex[id]!.OocPartner!.species);
  embed
    .setDescription(
      `Your ${partnerName} evolved into a ${pokeHelper.displayName(species)}!`,
    )
    .setTitle("Congratulations!")
    .setThumbnail(
      await pokeHelper.getSprite(
        charaDex[id]!.OocPartner!.species,
        charaDex[id]!.OocPartner!.gender,
        charaDex[id]!.OocPartner!.shiny,
      ),
    )
    .setColor(0xFFFFFF);
  return { embeds: [embed], ephemeral: true };
}

export async function setNick(id: string, nick: string | undefined) {
  const charaDex = await characterHelper.getUsers();
  if (charaDex[id]?.OocPartner) {
    if (nick) {
      charaDex[id]!.OocPartner.nickname = nick;
    } else {
      delete charaDex[id]!.OocPartner.nickname;
    }
    await characterHelper.saveUsersExternal(charaDex);
  }
}
export async function editHappiness(id: string, affectionChange: number) {
  const charaDex = await characterHelper.getUsers();
  if (charaDex[id]?.OocPartner) {
    charaDex[id].OocPartner.happiness = Math.max(
      getLevelFromExp(charaDex[id].OocPartner.experience),
      charaDex[id].OocPartner.happiness + affectionChange,
    );
    await characterHelper.saveUsersExternal(charaDex);
  }
}

export async function fedPartner(id: string, affection: number) {
  const charaDex = await characterHelper.getUsers();
  if (charaDex[id]?.OocPartner) {
    charaDex[id].OocPartner.canFeed = false;
    charaDex[id].OocPartner.happiness += affection;
    charaDex[id].OocPartner.lastInteracted == new Date();
    await characterHelper.saveUsersExternal(charaDex);
  }
}

export async function playWithPartner(id: string) {
  const charaDex = await characterHelper.getUsers();
  if (charaDex[id]?.OocPartner) {
    charaDex[id].OocPartner.canPlay = false;
    charaDex[id].OocPartner.happiness += 1;
    charaDex[id].OocPartner.lastInteracted == new Date();
    await characterHelper.saveUsersExternal(charaDex);
  }
}