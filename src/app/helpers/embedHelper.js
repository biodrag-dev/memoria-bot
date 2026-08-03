
async function partnerView(character) {
  let partnerNick = character.partner.nickname
    ? character.partner.nickname
    : pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  let color =
    character.house == "Victini"
      ? "Red"
      : character.house == "Jirachi"
        ? "Yellow"
        : character.house == "Mew"
          ? "Blue"
          : "Black";
  const embed = new EmbedBuilder()
    .setTitle(`${partnerNick} | ${character.name}'s partner!`)
    .setThumbnail(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    )
    .setColor(color).setDescription();
  return embed;
}


module.exports = {
  pokeEmbedCreate,
};
