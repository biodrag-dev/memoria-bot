import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Client, EmbedBuilder } from "discord.js";

import * as pokehelper from "./pokeHelper";

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
const jsonsPath = path.resolve(__dirname, "../../../jsons");

let submitDex: SubmitDex;
let evoDex: EvoDex;

export async function toProperCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function loadSubmissions() {
  if (!submitDex) {
    const data = await fs.readFile(`${jsonsPath}/submissions.json`, "utf8");
    submitDex = JSON.parse(data) as SubmitDex;
  }
}

async function saveSubmissions() {
  await fs.writeFile(
    `${jsonsPath}/submissions.json`,
    JSON.stringify(submitDex, null, 2),
    "utf8",
  );
}

async function loadEvos() {
  if (!evoDex) {
    const data = await fs.readFile(`${jsonsPath}/evoDestinations.json`, "utf8");
    evoDex = JSON.parse(data) as EvoDex;
  }
}

async function saveEvos() {
  await fs.writeFile(
    `${jsonsPath}/evoDestinations.json`,
    JSON.stringify(evoDex, null, 2),
    "utf8",
  );
}

//checks if the destination is valid, ie. the evo isn't taken, or they've already reserved it
export async function checkDestination(id: string, name: string) {
  await loadEvos();
  if (
    !evoDex[`${name}`] ||
    (evoDex[`${name}`]!.user == id && evoDex[`${name}`]!.status != "Approved")
  )
    return true;
  return false;
}

export async function getDestination(name: string): Promise<EvoData> {
  await loadEvos();
  return evoDex[`${name}`]!;
}

//approves a reservation
export async function approveDestination(name: string) {
  await loadEvos();
  evoDex[`${name}`]!.status = "Approved";
  evoDex[`${name}`]!.dateMade = new Date();
  await saveEvos();
}

//deletes a destination
export async function deleteDestination(name: string) {
  await loadEvos();
  delete evoDex[`${name}`];
  await saveEvos();
}

export function reserveExpireDate(name: string) {
  const expirationDate = new Date(evoDex[`${name.toLowerCase()}`]!.dateMade);
  expirationDate.setMonth(expirationDate.getMonth() + 1);
  return expirationDate;
}

export function getReserveOfUser(id: string) {
  loadEvos();
  return Object.entries(evoDex)
    .filter(([_, data]) => data.user === id && data.status === "Reserved")
    .map(([name]) => name);
}

//creates a destination entry with reserved status. will override existing ones
async function createDestination(id: string, name: string) {
  loadEvos();
  const evoData: EvoData = {
    user: id,
    status: "Reserved",
    dateMade: new Date(),
  };
  evoDex[`${name}`] = evoData;
  saveEvos();
}

export async function hasSubmit(id: string) {
  await loadSubmissions();
  if (submitDex[`${id}`] && submitDex[`${id}`]!.status != "Temporary")
    return true;
  return false;
}
export async function denySubmit(id: string) {
  await loadEvos();
  await loadSubmissions();
}

export async function approveSubmit() {
  await loadEvos();
  await loadSubmissions();
}

export async function createSubmit(
  id: string,
  name: string,
  house: string,
  docLink: string,
  partner: string,
) {
  await loadSubmissions();
  await loadEvos();
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

  if (!evoDex[`${partner}`]) {
    const evoData: EvoData = {
      user: id,
      status: "Temporary",
      dateMade: new Date(),
    };
    evoDex[`${partner}`] = evoData;
    await saveEvos();
  }
  await saveSubmissions();
}

export async function continueSubmit(id: string) {
  await loadSubmissions();
  submitDex[`${id}`]!.status = "Reviewing";
  await createDestination(id, submitDex[`${id}`]!.partner);

  await saveSubmissions();
}

export async function getSubmit(id: string): Promise<SubmitData> {
  await loadSubmissions();
  return submitDex[`${id}`]!;
}

export async function deleteSubmit(id: string) {
  await loadSubmissions();
  await loadEvos();
  const partner = submitDex[`${id}`]!.partner;
  if (evoDex[`${partner}`]!.status == "Temporary") {
    delete evoDex[`${partner}`];
    await saveEvos();
  }
  delete submitDex[`${id}`];

  await saveSubmissions();
}

export async function clearTemporary() {
  console.log("Temporary submissions cleared!");
  await loadSubmissions();
  await loadEvos();
  const tempSubs = Object.entries(submitDex)
    .filter(([_, data]) => data.status === "Temporary")
    .map(([key]) => key);

  for (const chara of tempSubs) {
    await deleteSubmit(chara);
  }
}

export async function clearExpiredReserves() {
  await loadEvos();
  const now = new Date();

  for (const [destination, evo] of Object.entries(evoDex)) {
    if (evo.status !== "Reserved") continue;
    const expirationDate = new Date(evo.dateMade);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    if (now >= expirationDate) {
      await deleteDestination(destination);
    }
  }
}

export async function reviewEmbed(id: string, status: string) {
  await loadSubmissions();
  const submission = submitDex[`${id}`]!;
  const pokemon = await pokehelper.findPokemon(submission.partner);

  const embed = new EmbedBuilder()
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon!.id}.png`,
    )
    .setDescription(
      `**House** | ${submission.house}\n**Evolutionary Destination** | ${await toProperCase(submission.partner)}\n**Document Link**\n${submission.docLink}`,
    )
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

export async function getAllApprovedPartnerEntries() {
  await loadEvos();
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

export async function getAllReservedPartnerEntries() {
  await loadEvos();
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
  loadEvos();

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
  loadEvos();
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
  console.log(reservations);
  return reservations;
}
