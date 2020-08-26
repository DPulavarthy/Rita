module.exports.run = async (client, message, args) => {
  const queue = message.client.queue.get(message.guild.id), member = message.guild.members.cache.get(message.author.id);
  if (!queue) return message.channel.send(client.comment(`There is nothing playing.`));
  if (member.voice.channel !== member.guild.me.voice.channel) return message.channel.send(client.comment(`You need to be in the same voice channel as the bot!`));
  if (!args[0]) return message.channel.send(client.comment(`The current volume is: ${queue.volume}%`));
  if (isNaN(args[0])) return message.channel.send(client.comment(`Please use a number to set volume.`));
  if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0) return message.channel.send(client.comment(`Please use a number between 0 - 100.`));
  queue.volume = args[0];
  queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
  return queue.textChannel.send(client.comment(`Volume set to: ${args[0]}%`));
}

module.exports.code = {
  title: "volume",
  about: "Volume of the player",
  usage: ["%P% volume"],
  alias: ["v", "vol"],
}