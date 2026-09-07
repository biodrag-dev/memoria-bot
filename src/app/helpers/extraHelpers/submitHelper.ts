import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Client, EmbedBuilder } from "discord.js";

import * as pokehelper from "../pokeHelper";

interface SubmitData {
  name: string;
  house: string;
  docLink: string;
  partner: string;
  status: string;
  shinyRoll: number;
  alphaRoll: number;
}

interface EvoData {
  user: string;
  status: string;
  dateMade: Date;
}

type SubmitDex = Record<string, SubmitData>;
type EvoDex = Record<string, EvoData>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonsPath = path.resolve(__dirname, "../../../../jsons");

let submitDex: SubmitDex = await loadSubmissions();
let evoDex: EvoDex = await loadEvos();

export async function toProperCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function loadSubmissions() {
  const data = await fs.readFile(`${jsonsPath}/submissions.json`, "utf8");
  return JSON.parse(data) as SubmitDex;
}

async function saveSubmissions() {
  await fs.writeFile(
    `${jsonsPath}/submissions.json`,
    JSON.stringify(submitDex, null, 2),
    "utf8",
  );
}

async function loadEvos() {
  const data = await fs.readFile(`${jsonsPath}/evoDestinations.json`, "utf8");
  return JSON.parse(data) as EvoDex;
}

async function saveEvos() {
  await fs.writeFile(
    `${jsonsPath}/evoDestinations.json`,
    JSON.stringify(evoDex, null, 2),
    "utf8",
  );
}

//checks if the destination is valid, ie. the evo isn't taken, or they've already reserved it
export function checkDestination(id: string, name: string) {
  if (
    !evoDex[`${name}`] ||
    (evoDex[`${name}`]!.user == id && evoDex[`${name}`]!.status != "Approved")
  )
    return true;
  return false;
}

export function getDestination(name: string): EvoData {
  return evoDex[`${name}`]!;
}

//approves a reservation
export function approveDestination(name: string) {
  evoDex[`${name}`]!.status = "Approved";
  evoDex[`${name}`]!.dateMade = new Date();
  saveEvos();
}

//deletes a destination
export function deleteDestination(name: string) {
  delete evoDex[`${name}`];
  saveEvos();
}

export function reserveExpireDate(name: string) {
  const expirationDate = new Date(evoDex[`${name.toLowerCase()}`]!.dateMade);
  expirationDate.setMonth(expirationDate.getMonth() + 1);
  return expirationDate;
}

export function getReserveOfUser(id: string) {
  return Object.entries(evoDex)
    .filter(([_, data]) => data.user === id && data.status === "Reserved")
    .map(([name]) => name);
}

//creates a destination entry with reserved status. will override existing ones
function createDestination(id: string, name: string) {
  const evoData: EvoData = {
    user: id,
    status: "Reserved",
    dateMade: new Date(),
  };
  evoDex[`${name}`] = evoData;
  saveEvos();
}

export function hasSubmit(id: string) {
  if (submitDex[`${id}`] && submitDex[`${id}`]!.status != "Temporary")
    return true;
  return false;
}

export function createSubmit(
  id: string,
  name: string,
  house: string,
  docLink: string,
  partner: string,
) {
  const shinyRoll = Math.floor(Math.random() * 20) + 1;
  const alphaRoll = Math.floor(Math.random() * 20) + 1;

  const submitData: SubmitData = {
    name,
    house,
    docLink,
    partner,
    status: "Temporary",
    shinyRoll,
    alphaRoll,
  };

  submitDex[`${id}`] = submitData;

  if (!evoDex[`${partner}`] && docLink != "STAFF NPC") {
    const evoData: EvoData = {
      user: id,
      status: "Temporary",
      dateMade: new Date(),
    };
    evoDex[`${partner}`] = evoData;
    saveEvos();
  }
  saveSubmissions();
}

export function continueSubmit(id: string) {
  submitDex[`${id}`]!.status = "Reviewing";
  if (submitDex[`${id}`]!.docLink != "STAFF NPC") {
    createDestination(id, submitDex[`${id}`]!.partner);
  }

  saveSubmissions();
}

export function getSubmit(id: string): SubmitData {
  return submitDex[`${id}`]!;
}

export function deleteSubmit(id: string) {
  const partner = submitDex[`${id}`]!.partner;
  if (submitDex[`${id}`]?.docLink != "STAFF NPC" && evoDex[`${partner}`]!.status == "Temporary") {
    delete evoDex[`${partner}`];
    saveEvos();
  }
  delete submitDex[`${id}`];

  saveSubmissions();
}

export function clearTemporary() {
  const tempSubs = Object.entries(submitDex)
    .filter(([_, data]) => data.status === "Temporary")
    .map(([key]) => key);

  for (const chara of tempSubs) {
    deleteSubmit(chara);
  }
  saveSubmissions();
}

export function clearExpiredReserves() {
  const now = new Date();

  for (const [destination, evo] of Object.entries(evoDex)) {
    if (evo.status !== "Reserved") continue;
    const expirationDate = new Date(evo.dateMade);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    if (now >= expirationDate) {
      deleteDestination(destination);
    }
  }
}

export async function reviewEmbed(id: string, status: string) {
  const submission = submitDex[`${id}`]!;
  const pokemon = await pokehelper.findPokemon(submission.partner);

  const embed = new EmbedBuilder()
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon!.id}.png`,
    )
    .setDescription(
      `**House** | ${submission.house}\n**Evolutionary Destination** | ${await toProperCase(submission.partner)}\n**Document Link**\n${submission.docLink}`,
    ).addFields({
      name: `**Roleplayer**`,
      value: `<@${id}>`,
      inline: true,
    },)
    .setFooter({
      text: `use /submit character to submit your oc! our template is required.`,
    });

  switch (status) {
    case "Reviewing":
      embed.setTitle(`Under Review | ${submission.name}`);
      embed.setColor("#f3d737");
      break;
    case "Denied":
      embed.setTitle(`Denied | ${submission.name}`);
      embed.setColor("#ce1b1b");
      break;
    case "Approved":
      embed.setTitle(`Approved | ${submission.name}`);
      embed.setColor("#2fdf5b");
      break;
  }

  return embed;
}

export function getAllApprovedPartnerEntries() {
  let array = [];
  for (const [destination, evo] of Object.entries(evoDex)) {
    if (evo.status == "Approved") {
      array.push(`${pokehelper.displayName(destination)} | <@${evo.user}>`);
    }
  }
  array.sort();
  if (array.length == 0) {
    return "No approved characters exist right now. Why don't you change that?";
  }
  return array.join("\n");
}

export function getAllReservedPartnerEntries() {
  const now = new Date();
  let array = [];

  for (const [destination, evo] of Object.entries(evoDex)) {
    if (evo.status !== "Approved") {
      const expirationDate = new Date(evo.dateMade);
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      array.push(
        `${pokehelper.displayName(destination)} | <@${evo.user}> | Expires <t:${Math.floor(expirationDate.getTime() / 1000)}:D>`,
      );
    }
  }
  if (array.length == 0) {
    return "No reservations are ongoing right now. Why don't you change that?";
  }
  return array.join("\n");
}

export async function verifyCanReserve(userId: string, speciesName: string) {
  if ((await pokehelper.isLegendOrMyth(speciesName.toLowerCase())) === true) {
    return -3;
  }

  const existingReserve = evoDex[`${speciesName}`];
  //if they cannot reserve (-1)
  if (existingReserve) {
    return -1;
  }

  const userReserve = getReserveOfUser(userId);
  var userReserveName;
  if (userReserve.length != 0) {
    userReserveName = userReserve[0];
  }

  //if user has an existing reserve
  if (userReserveName) {
    const changeDate = new Date(evoDex[`${userReserveName}`]!.dateMade);
    changeDate.setDate(changeDate.getDate() + 7);

    const now = new Date();
    const difference = now.getTime() - changeDate.getTime();
    //if they have an existing reserve but it can be swapped (-2)
    if (difference > 0) {
      return -2;
    } else {
      return Math.floor(changeDate.getTime() / 1000);
    }
  }

  //if species doesn't have an existing reserve & no problems with taking it (0)
  return 0;
}

export function createProperReserve(userId: string, speciesName: string) {
  const userReserve = getReserveOfUser(userId);
  if (userReserve.length != 0) {
    delete evoDex[`${userReserve[0]}`];
  }

  createDestination(userId, speciesName);
}

export async function getAllReserves(client: Client): Promise<any[]> {
  const reservations = await Promise.all(
    Object.entries(evoDex)
      .filter(([_, reservation]) => reservation.status === "Reserved")
      .map(async ([key, reservation]) => {
        const user = await client.users.fetch(reservation.user);
        return {
          value: key,
          name: `${pokehelper.displayName(key)} | ${user.username}`,
        };
      }),
  );
  return reservations;
}
