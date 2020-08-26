module.exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id), member = message.guild.members.cache.get(message.author.id);
  if (!queue) return message.channel.send(client.comment(`There is nothing playing.`));
  if (member.voice.channel !== member.guild.me.voice.channel) return message.channel.send(client.comment(`You need to be in the same voice channel as the bot!`));
  queue.playing = true;
  queue.connection.dispatcher.end();
  return queue.textChannel.send(client.comment(`Skipped the track`));
}

module.exports.code = {
  title: "skip",
  about: "Skips the track",
  usage: ["%P% skip"],
}