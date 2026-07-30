// import { REST, Routes } from "discord.js";

// process.loadEnvFile(".env");

// const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// const clientId = process.env.CLIENT_ID!;
// const guildId = process.env.GUILD_ID!;

// const global = await rest.get(
//   Routes.applicationCommands(clientId)
// );

// const guild = await rest.get(
//   Routes.applicationGuildCommands(clientId, guildId)
// );

// console.log("Global:", global);
// console.log("Guild:", guild);

// // Clear global commands
// await rest.put(
//   Routes.applicationCommands(clientId),
//   { body: [] },
// );

// console.log("Cleared global commands");

// // Clear guild commands
// await rest.put(
//   Routes.applicationGuildCommands(clientId, guildId),
//   { body: [] },
// );

// console.log("Cleared guild commands");