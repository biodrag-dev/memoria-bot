import { findPokemon, latestGenLearnset } from "@/app/helpers/pokeHelper";
import type { EventHandler } from "commandkit";
import { EmbedBuilder, ForumChannel } from "discord.js";

const KEYWORD = "!WHAT IS";

const handler: EventHandler<"messageCreate"> = async (message) => {
    if (message.author.bot || message.webhookId) return;
    if (!message.guild) return;

    if (message.content.trim().startsWith(KEYWORD)) {
        const pokemon = await findPokemon("meowscarada");
        const generations = latestGenLearnset(pokemon!);
        // Optional
       
        console.log(generations);
    }
};

export default handler;

