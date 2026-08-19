import {
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";
import * as pokeHelper from "../helpers/pokeHelper";
import * as partnerHelper from "../helpers/partnerHelper";
import * as starterQuizHelper from "../helpers/starterQuizHelper";

export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

export const command: CommandData = {
  name: "partner",
  description: "random pokemon",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "view",
      description: "view your partner pokemon!",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  //if no pokemon
  if ((await partnerHelper.getPartner(interaction.user.id)) === undefined) {
    if (!starterQuizHelper.getSession(interaction.user.id)) {
      starterQuizHelper.createSession(interaction.user.id);
    } else if (
      starterQuizHelper.getSession(interaction.user.id)?.questionIndex == 10
    ) {
      await interaction.reply(
        await partnerHelper.getProspects(interaction.user.id),
      );
    }
    await interaction.reply(
      starterQuizHelper.createQuestionMessage(interaction.user.id),
    );
  } else {
    const embed = await partnerHelper.getPartnerEmbed(
      interaction.user.username,
      interaction.user.id,
    );
    await interaction.reply({
      embeds: [embed],
    });
  }

  //   const pokemon = await pokeHelper.getRandomPokemonByType(type);
  //   const basemon = await pokeHelper.findBaseMon(pokemon);
  //   const prospect = await partnerHelper.generatePartnerProspect(basemon.name);
  //   const prospectEmbed = await partnerHelper.getPartnerProspectEmbed(prospect);
  //   await interaction.reply({
  //     embeds: [prospectEmbed],
  //     ephemeral: true,
  //   });
};
