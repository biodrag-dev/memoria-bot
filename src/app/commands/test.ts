import {
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";

import * as proxyHelper from "../helpers/proxyHelper";
import * as tmHelper from "../helpers/tmHelper";

export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

export const command: CommandData = {
  name: "test",
  description: "tests",
  default_member_permissions: "0",

  contexts: [InteractionContextType.Guild],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;
};  
