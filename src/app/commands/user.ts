import type {
  ChatInputCommand,
  CommandData,
  CommandMetadata,
} from "commandkit";
import {
  ColorResolvable,
  EmbedBuilder,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  TextChannel,
} from "discord.js";
const DEFAULT_CATEGORY = 0;

import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionContextType,
} from "discord.js";

import * as characterHelper from "../helpers/characterHelper";
import * as tmHelper from "../helpers/tmHelper";
import * as proxyHelper from "../helpers/proxyHelper";
import * as inventoryHelper from "../helpers/extraHelpers/inventoryHelper";

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("set-accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("set-decline")
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger),
);

const evoRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("evolve-accept")
    .setLabel("Proceed")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId("evolve-decline")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger),
);

export const metadata: CommandMetadata = {
  guilds: [`${process.env.GUILD_ID}`],
};

export const command: CommandData = {
  name: "character",
  description: "Character commands",
  contexts: [InteractionContextType.Guild],
  options: [
    {
      name: "view",
      description: "View your character",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Whose profile are you viewing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },

    {
      name: "edit",
      description: "Edit your character's bio",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Whose profile are you editing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: "field",
          description: "Which field are you editing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Age", value: "age" },
            { name: "Gender", value: "gender" },
            { name: "Bio", value: "bio" },
            { name: "Pronouns", value: "pronouns" },
          ],
        },
        {
          name: "information",
          description: "What are you filling in the detail with?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "edit-image",
      description: "Edit your character's display image",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Whose profile are you editing?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: "art",
          description: "Profile art!",
          type: ApplicationCommandOptionType.Attachment,
          required: true,
          file_types: ["image"],
        },
        {
          name: "artist-credit",
          description: "Who drew the art you are now using?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "proxy",
      description: "Proxy commands",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "edit",
          description: "edit details of your proxies!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Which proxy are you editing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "nickname",
              description: "The name that shows up for the proxy!",
              type: ApplicationCommandOptionType.String,
              required: false,
              max_length: 40,
            },
            {
              name: "profile-picture",
              description: "The avatar for the proxy!",
              type: ApplicationCommandOptionType.Attachment,
              required: false,
              file_types: ["image"],
            },
            {
              name: "prefix",
              description:
                'Proxy trigger (ie. tx:text would send "text" linked to the associated tx: prefix)',
              type: ApplicationCommandOptionType.String,
              required: false,
              max_length: 20,
            },
            {
              name: "color",
              description: "(Hex code) color of its embed!",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
        {
          name: "view",
          description: "view your proxy details",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Which proxy are you viewing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },
      ],
    },
    {
      name: "inventory",
      description: "View your inventory here!",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "view",
          description: "View a character's inventory!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Which character's inventory are you viewing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: "use",
          description: "Use an item in a character's inventory!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "Which character's inventory are you viewing?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "item",
              description:
                "Which item in the character's inventory are you using?",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ],
        },
      ],
    },
  ],
};

export const autocomplete = async (ctx: any) => {
  const interaction = ctx.interaction;
  const focused = interaction.options.getFocused(true);
  const names = characterHelper.getCharacterNames(interaction.user.id);

  const sub = interaction.options.getSubcommand();
  if (focused.name == "item" && sub == "use") {
    return await interaction.respond(
      inventoryHelper.getUsableCharacterItems(
        interaction.user.id,
        interaction.options.getString("name", true),
      ),
    );
  }
  if (
    interaction.options.getSubcommandGroup() == "proxy" &&
    focused.name == "name"
  ) {
    return await interaction.respond(
      proxyHelper.getAllProxyNames(interaction.user.id),
    );
  }

  if (interaction.options.getSubcommand() == "set") {
    const characterId = interaction.options.getString("name", false);

    if (focused.name === "field") {
      if (!characterId) {
        return await interaction.respond([]);
      } else {
        const fields = await characterHelper.getSetPartnerFields(
          interaction.user.id,
          characterId,
        );
        return await interaction.respond(fields);
      }
    }
  }

  const filtered = names
    .filter((name: string) => name.toLowerCase())
    .slice(0, 25);

  return interaction.respond(
    filtered.map((name: string) => ({
      name,
      value: name,
    })),
  );
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const interaction = ctx.interaction;

  const group = interaction.options.getSubcommandGroup();
  const sub = interaction.options.getSubcommand();
  if (group === "inventory") {
    if (sub === "view") {
      return interaction.reply(
        inventoryHelper.getCharacterInventoryItems(
          interaction.user.id,
          interaction.options.getString("name", true),
          DEFAULT_CATEGORY,
        ) as InteractionReplyOptions,
      );
    } else if (sub === "use") {
      const [category, item] = interaction.options
        .getString("item", true)
        .split(":");

      return interaction.reply({
        embeds: [
          await inventoryHelper.useItem(
            interaction.client,
            interaction.user.id,
            interaction.options.getString("name", true),
            Number(item),
          ),
        ],
        ephemeral: true,
      });
    }
  }
  } else if (sub === "view") {
    const character = interaction.options.getString("name", true);
    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      character,
    );

    return interaction.reply({
      embeds: [embed],
    });
  } else if (sub === "edit") {
    await characterHelper.editCharacter(
      interaction.user.id,
      interaction.options.getString("name", true),
      interaction.options.getString("field", true),
      interaction.options.getString("information", true),
    );

    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      interaction.options.getString("name", true),
    );

    characterHelper.updateCharaForumPost(
      interaction.user.id,
      interaction.options.getString("name", true),
      interaction.client,
    );

    return interaction.reply({
      content: `Your character's profile has been edited!`,
      embeds: [embed],
      ephemeral: true,
    });
  } else if (sub === "edit-image") {
    await characterHelper.editCharacter(
      interaction.user.id,
      interaction.options.getString("name", true),
      "img_link",
      interaction.options.getAttachment("art", true).url,
    );
    await characterHelper.editCharacter(
      interaction.user.id,
      interaction.options.getString("name", true),
      "artist_credits",
      interaction.options.getString("artist-credit", true),
    );

    const embed = await characterHelper.getCharacterEmbed(
      interaction.user.id,
      interaction.options.getString("name", true),
    );

    characterHelper.updateCharaForumPost(
      interaction.user.id,
      interaction.options.getString("name", true),
      interaction.client,
    );
    return interaction.reply({
      content: `Your character's profile has been edited!`,
      embeds: [embed],
      ephemeral: true,
    });
  } else if (sub === "shop") {
    await interaction.deferReply();

    const result = await inventoryHelper.getStoreEntry(
      interaction.user.id,
      interaction.options.getString("name", true),
      -1,
    );
    console.log(result);
    return interaction.editReply(result as InteractionEditReplyOptions);
  } else if (sub === "balance") {
    return interaction.reply({
      embeds: [
        await proxyHelper.balanceEmbed(
          interaction.user.id,
          interaction.options.getString("name", true),
        ),
      ],
    });
  }
};
