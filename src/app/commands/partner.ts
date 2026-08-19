import {
  ApplicationCommandOptionType,
  Embed,
  EmbedBuilder,
  InteractionContextType,
} from "discord.js";

import type {
  CommandData,
  ChatInputCommand,
  CommandMetadata,
} from "commandkit";
import * as partnerHelper from "../helpers/partnerHelper";
import * as charaHelper from "../helpers/characterHelper";

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
      description: "feed your partner pokemon! (resets daily)",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "play",
      description: "play with your partner pokemon! (resets daily)",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "nick",
      description: "nickname your partner pokemon!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "nickname",
          description:
            "nicknames your pokemon (leave blank to remove nickname)",
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;
  const sub = interaction.options.getSubcommand();
  const group = interaction.options.getSubcommandGroup();
  const partner = await partnerHelper.getPartner(interaction.user.id);
  //if no pokemon
  if (partner === undefined) {
    return await interaction.reply(
      await partnerHelper.generateStartingEmbed(interaction.user.id),
    );
  }

  if (partnerHelper.isNewDate(partner.reset)) {
    await charaHelper.resetDailies(
      interaction.user.id,
      partnerHelper.getRandomPrompt(),
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
  } else if (sub === "nick") {
    const name = interaction.options.getString("nickname", false)!;
    await charaHelper.setNick(interaction.user.id, name);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `Your partner has been nicknamed successfully! Check it out with **/partner view**!`,
      );
    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  } else if (sub === "feed") {
    if (partner?.canFeed) {
      return interaction.reply(
        await partnerHelper.generateFeedingPrompt(interaction.user.id),
      );
    } else {
      const embed = new EmbedBuilder()
        .setColor("Grey")
        .setDescription(`You've already fed your partner today!`);
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  } else if (sub === "play") {
    if (partner?.canPlay) {
      return interaction.reply(
        await partnerHelper.playTime(interaction.user.id),
      );
    } else {
      const embed = new EmbedBuilder()
        .setColor("Grey")
        .setDescription(`You've already played with your partner today!`);
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
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
