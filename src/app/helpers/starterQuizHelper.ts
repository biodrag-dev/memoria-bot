import { StringSelectMenu } from "commandkit";
import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

interface QuizSession {
  questionIndex: number;
  types: Record<PokemonType, number>;
}

export const sessions = new Map<string, QuizSession>();

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

interface Question {
  question: string;
  options: Option[];
}
interface Option {
  label: string;
  value: string;
}

export function createSession(id: string) {
  sessions.set(id, {
    questionIndex: 0,
    types: {
      normal: 0,
      fire: 0,
      water: 0,
      electric: 0,
      grass: 0,
      ice: 0,
      fighting: 0,
      poison: 0,
      ground: 0,
      flying: 0,
      psychic: 0,
      bug: 0,
      rock: 0,
      ghost: 0,
      dragon: 0,
      dark: 0,
      steel: 0,
      fairy: 0,
    },
  });
}

export function createQuestionMessage(id: string) {
  const question = questions[sessions.get(id)!.questionIndex]!;
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`starter_quiz:${id}:${sessions.get(id)!.questionIndex}`)
    .setPlaceholder(`select an option...`)
    .addOptions(
      question.options.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    menu,
  );

  const embed = new EmbedBuilder()
    .setTitle(
      `Starter Assessment | Question ${sessions.get(id)!.questionIndex + 1}`,
    )
    .setDescription(question.question).setFooter({text: `quiz taken and modified from pokemon reborn`}).setAuthor({name: `You cannot change your starter after you choose one!`});

  return {
    embeds: [embed],
    components: [row],
    ephemeral: true,
  };
}

export function getSession(id: string): QuizSession | undefined {
  return sessions.get(id);
}

export function hasSession(id: string): boolean {
  if (sessions.has(id)) {
    return true;
  }
  return false;
}

export function submitQuestion(id: string, result: string) {
  const session = sessions.get(id)!;
  session.questionIndex += 1;
  const typePoints = result.split(",");
  for (const type of typePoints) {
    session.types[type as PokemonType]++;
  }
}

export function getResults(id: string) {
  const session = sessions.get(id)!;
  const sortedResults = Object.entries(session.types)
    .map(([key, value]) => ({ id: key, value }))
    .sort((a, b) => {
      if (a.value === b.value) {
        return Math.random() - 0.5;
      }
      return b.value - a.value;
    });

  return [sortedResults[0]!.id, sortedResults[1]!.id, sortedResults[2]!.id];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//    QUIZ QUESTIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////

const question1: Question = {
  question: `Hey there, it looks like you don't have a partner yet! Why don't we help you find one?
  
Let's start it off simple. What's your favorite color?`,
  options: [
    {
      label: `Red`,
      value: `fire,dragon`,
    },
    {
      label: `Yellow`,
      value: `electric,rock`,
    },
    {
      label: `Green`,
      value: `grass,normal`,
    },
    {
      label: `Blue`,
      value: `water,flying`,
    },
    {
      label: `Orange`,
      value: `ground,fighting`,
    },
    {
      label: `Purple`,
      value: `ghost,poison`,
    },
    {
      label: `Pink`,
      value: `fairy,psychic`,
    },
    {
      label: `White`,
      value: `steel,ice`,
    },
    {
      label: `Black`,
      value: `dark,bug`,
    },
  ],
};
const question2: Question = {
  question: `What kind of weather do you find most appealing?`,
  options: [
    {
      label: `Clear and sunny!`,
      value: `fire,normal`,
    },
    {
      label: `Rain is comforting`,
      value: `water,grass`,
    },
    {
      label: `A sandstorm would be pretty awesome`,
      value: `rock,ground`,
    },
    {
      label: `Snow is pretty!`,
      value: `ice,ghost`,
    },
    {
      label: `A relaxing overcast`,
      value: `dark,bug`,
    },
    {
      label: `I love when it's windy`,
      value: `flying,fighting`,
    },
    {
      label: `Rainbows. Rainbows everywhere.`,
      value: `fairy,electric`,
    },
    {
      label: `I don't have a favorite weather.`,
      value: `steel,psychic`,
    },
    {
      label: `Hail is super cool!`,
      value: `dragon,poison`,
    },
  ],
};
const question3: Question = {
  question: `What is your idea of "Success"?`,
  options: [
    {
      label: `Having lots of great friends!`,
      value: `fairy,ghost`,
    },
    {
      label: `A stable and progressive career`,
      value: `fighting,grass`,
    },
    {
      label: `Lots of money`,
      value: `steel,ice`,
    },
    {
      label: `Finding true love`,
      value: `water,rock`,
    },
    {
      label: `Success is when you stop chasing it`,
      value: `dragon,fire`,
    },
    {
      label: `Being famous!`,
      value: `electric,flying`,
    },
    {
      label: `Enlightenment and acquisition of knowledge`,
      value: `bug,psychic`,
    },
    {
      label: `Prestige; Reputation; Respectability`,
      value: `poison,dark`,
    },
    {
      label: `Anything as long as you're happy`,
      value: `normal,ground`,
    },
  ],
};
const question4: Question = {
  question: `What are you most afraid of?`,
  options: [
    {
      label: `I'm not afraid of anything`,
      value: `ground,fighting`,
    },
    {
      label: `Rejection`,
      value: `steel,poison`,
    },
    {
      label: `Bugs are gross!`,
      value: `psychic,fairy`,
    },
    {
      label: `One specific very uncommon thing...`,
      value: `dragon,grass`,
    },
    {
      label: `Losing those close to me`,
      value: `ghost,normal`,
    },
    {
      label: `Missing out`,
      value: `ice,electric`,
    },
    {
      label: `Of staying the same forever`,
      value: `flying,water`,
    },
    {
      label: `Myself`,
      value: `dark,rock`,
    },
    {
      label: `Like I'd tell you!`,
      value: `fire,bug`,
    },
  ],
};
const question5: Question = {
  question: `Which best describes you?`,
  options: [
    {
      label: `I have friends but I'm still lonely`,
      value: `normal,ground`,
    },
    {
      label: `I'm always trying to run away`,
      value: `flying,rock`,
    },
    {
      label: `Others always misunderstand me`,
      value: `ice,grass`,
    },
    {
      label: `I drive everyone away`,
      value: `poison,fire`,
    },
    {
      label: `I end up regretting a lot of things`,
      value: `ghost,fighting`,
    },
    {
      label: `I'm not good enough at anything`,
      value: `psychic,dark`,
    },
    {
      label: `Most people just ignore me`,
      value: `bug,electric`,
    },
    {
      label: `Others need to get on my level`,
      value: `dragon`,
    },
    {
      label: `Everything is pointless.`,
      value: `steel,fairy`,
    },
  ],
};
const question6: Question = {
  question: `How do you feel about romantic relationships?`,
  options: [
    {
      label: `Like I always need to be in one`,
      value: `electric,fire`,
    },
    {
      label: `Who cares?`,
      value: `ghost,dragon`,
    },
    {
      label: `It would be nice to be cared for...`,
      value: `poison,ground`,
    },
    {
      label: `They're too often just a distraction`,
      value: `fighting,psychic`,
    },
    {
      label: `I do better alone.`,
      value: `dark,psychic`,
    },
    {
      label: `They can add a lot to life!`,
      value: `grass,water`,
    },
    {
      label: `Thanks for reminding me :c`,
      value: `bug,electric`,
    },
    {
      label: `Self-acceptance is more important`,
      value: `water,normal`,
    },
    {
      label: `I like having someone to look after`,
      value: `rock,fairy`,
    },
  ],
};

const question7: Question = {
  question: `What's your ideal partner like? (Can be interpreted as romantic ooc or platonic pokemon partner)`,
  options: [
    {
      label: `Stable and level-headed`,
      value: `flying,grass`,
    },
    {
      label: `Hopeless romantics are cute`,
      value: `dark,bug`,
    },
    {
      label: `Romance is a capitalistic fabrication`,
      value: `steel,poison`,
    },
    {
      label: `I like the bad-ass types!`,
      value: `fairy,electric`,
    },
    {
      label: `Rational and supportive`,
      value: `fighting,rock`,
    },
    {
      label: `Someone who I can help find their voice`,
      value: `rock,water`,
    },
    {
      label: `Honest and direct`,
      value: `ice,normal`,
    },
    {
      label: `Dreams big and chases hard`,
      value: `ground,fire`,
    },
    {
      label: `Someone who can keep up with me.`,
      value: `dragon,psychic`,
    },
  ],
};

const question8: Question = {
  question: `What are your ideal friends like?`,
  options: [
    {
      label: `Absolutely inseparable`,
      value: `electric,bug`,
    },
    {
      label: `Just around when I need them`,
      value: `normal,rock`,
    },
    {
      label: `Talk to me often but don't cling`,
      value: `fire,psychic`,
    },
    {
      label: `We can just hang whenever`,
      value: `ground,steel`,
    },
    {
      label: `Loud and fun; likely to get into trouble!`,
      value: `fairy,dragon`,
    },
    {
      label: `Just one or two who know everything`,
      value: `poison,ice`,
    },
    {
      label: `I like knowing lots of different people`,
      value: `flying,fighting`,
    },
    {
      label: `Ideally? I don't need friends`,
      value: `dark,ghost`,
    },
    {
      label: `Always mutually supportive`,
      value: `grass,water`,
    },
  ],
};

const question9: Question = {
  question: `Which of these traits best describes you?`,
  options: [
    {
      label: `Independent/Strong-willed/Confident`,
      value: `fighting,fighting`,
    },
    {
      label: `Reserved/Timid/High-strung`,
      value: `ice,ice`,
    },
    {
      label: `Self-assured/Independent/Rational`,
      value: `steel,steel`,
    },
    {
      label: `Light-hearted/Playful/Versatile`,
      value: `normal,normal`,
    },
    {
      label: `Energetic/Impulsive/Affectionate`,
      value: `electric,electric`,
    },
    {
      label: `Insecure/Devoted/Unique`,
      value: `poison,poison`,
    },
    {
      label: `Prideful/Tough/Solitary`,
      value: `ground,ground`,
    },
    {
      label: `Isolatory/Mysterious/Reclusive`,
      value: `dark,dark`,
    },
    {
      label: `Free-thinking/Spirited/Stubborn`,
      value: `flying,flying`,
    },
    {
      label: `Intelligent/Analytical/Creative`,
      value: `psychic,psychic`,
    },
    {
      label: `Optimistic/Inspiring/Kind-hearted`,
      value: `fairy,fairy`,
    },
    {
      label: `Intellectual/Curious/Withdrawn`,
      value: `bug,bug`,
    },
    {
      label: `Passionate/Ambitious/Quick-tempered`,
      value: `fire,fire`,
    },
    {
      label: `Wise/Confident/Imaginative`,
      value: `dragon,dragon`,
    },
    {
      label: `Peaceful/Caring/Compassionate`,
      value: `grass,grass`,
    },
    {
      label: `Mischevious/Misunderstood/Humerous`,
      value: `ghost,ghost`,
    },
    {
      label: `Understanding/Even-tempered/Subdued`,
      value: `water,water`,
    },
    {
      label: `Steadfast/Loyal/Tough`,
      value: `rock,rock`,
    },
  ],
};
const question10: Question = {
  question: `Which is your favorite Type?`,
  options: [
    {
      label: `Normal`,
      value: `normal,normal,normal`,
    },
    {
      label: `Fire`,
      value: `fire,fire,fire`,
    },
    {
      label: `Water`,
      value: `water,water,water`,
    },
    {
      label: `Electric`,
      value: `electric,electric,electric`,
    },
    {
      label: `Grass`,
      value: `grass,grass,grass`,
    },
    {
      label: `Ice`,
      value: `ice,ice,ice`,
    },
    {
      label: `Fighting`,
      value: `fighting,fighting,fighting`,
    },
    {
      label: `Poison`,
      value: `poison,poison,poison`,
    },
    {
      label: `Ground`,
      value: `ground,ground,ground`,
    },
    {
      label: `Flying`,
      value: `flying,flying,flying`,
    },
    {
      label: `Psychic`,
      value: `psychic,psychic,psychic`,
    },
    {
      label: `Bug`,
      value: `bug,bug,bug`,
    },
    {
      label: `Rock`,
      value: `rock,rock,rock`,
    },
    {
      label: `Ghost`,
      value: `ghost,ghost,ghost`,
    },
    {
      label: `Dragon`,
      value: `dragon,dragon,dragon`,
    },
    {
      label: `Dark`,
      value: `dark,dark,dark`,
    },
    {
      label: `Steel`,
      value: `steel,steel,steel`,
    },
    {
      label: `Fairy`,
      value: `fairy,fairy,fairy`,
    },
  ],
};

const questions = [
  question1,
  question2,
  question3,
  question4,
  question5,
  question6,
  question7,
  question8,
  question9,
  question10,
];
