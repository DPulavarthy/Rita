module.exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send(client.comment(`There is nothing playing.`));
  const description = queue.songs.map((song, index) => `\`${index + 1}.)\` ${require(`discord.js`).escapeMarkdown(song.title)}`);
  let queueEmbed = client.embed().setTitle(`Track Queue`).setDescription(description);
  const splitDescription = require(`discord.js`).splitMessage(description, { maxLength: 2048, char: `\n`, prepend: ``, append: `` });
  return splitDescription.forEach(async (m) => { queueEmbed.setDescription(m); message.channel.send(queueEmbed); });
}

module.exports.code = {
  title: "queue",
  about: "Loop the queue",
  usage: ["%P% loop"],
  alias: ["q"],
}