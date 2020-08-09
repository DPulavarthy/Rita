module.exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send(client.comment(`There is nothing playing.`));
  let song = queue.songs[0], seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
  message.channel.send(client.embed().setTitle(`Now Playing`).setDescription(`${song.title}\n${song.url}`).setAuthor(song.duration > 0 ? `Time Remaining: ${new Date((song.duration - seek) * 1000).toISOString().substr(11, 8)}` : null));
  return client.log(message);
}

module.exports.code = {
  title: "np",
  about: "Currently playing track",
  usage: ["%P% np"],
  alias: ["nowplaying"],
}