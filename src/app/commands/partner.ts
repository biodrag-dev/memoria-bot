import {
  ApplicationCommandOptionType,
  InteractionContextType,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";
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
    {
      name: "feed",
      description: "play with your partner pokemon! (resets daily)",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "play",
      description: "play with your partner pokemon! (resets every 3 days)",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "nick",
      description: "nickname your partner pokemon!",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;
  const sub = interaction.options.getSubcommand();
  const group = interaction.options.getSubcommandGroup();

  //if no pokemon
  if ((await partnerHelper.getPartner(interaction.user.id)) === undefined) {
    if (!starterQuizHelper.getSession(interaction.user.id)) {
      // creates a session
      starterQuizHelper.createSession(interaction.user.id);
    } else if (
      //continues the quiz if an instance already exists
      starterQuizHelper.getSession(interaction.user.id)?.questionIndex == 10
    ) {
      return await interaction.reply(
        // if quiz is completed, gives results
        await partnerHelper.getProspects(interaction.user.id),
      );
    }
    return await interaction.reply(
      starterQuizHelper.createQuestionMessage(interaction.user.id),
    );
  }

  if (sub === "view") {
    const embed = await partnerHelper.getPartnerEmbed(
      interaction.user.username,
      interaction.user.id,
    );
    return await interaction.reply({
      embeds: [embed],
    });
  } else if (sub === "feed") {
    
  } else if (sub === "play") {
  } else if (sub === "nick") {
  }
  const embed = await partnerHelper.getPartnerEmbed(
    interaction.user.username,
    interaction.user.id,
  );
  await interaction.reply({
    embeds: [embed],
  });

  //   const pokemon = await pokeHelper.getRandomPokemonByType(type);
  //   const basemon = await pokeHelper.findBaseMon(pokemon);
  //   const prospect = await partnerHelper.generatePartnerProspect(basemon.name);
  //   const prospectEmbed = await partnerHelper.getPartnerProspectEmbed(prospect);
  //   await interaction.reply({
  //     embeds: [prospectEmbed],
  //     ephemeral: true,
  //   });
};
