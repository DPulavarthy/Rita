module.exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id), member = message.guild.members.cache.get(message.author.id);
  if (!queue) return message.channel.send(client.comment(`There is nothing playing.`));
  if (member.voice.channel !== member.guild.me.voice.channel) return message.channel.send(client.comment(`You need to be in the same voice channel as the bot!`));
  let songs = queue.songs;
  for (let i = songs.length - 1; i > 1; i--) { let j = 1 + Math.floor(Math.random() * i);[songs[i], songs[j]] = [songs[j], songs[i]]; };
  queue.songs = songs;
  message.client.queue.set(message.guild.id, queue);
  queue.textChannel.send(client.comment(`Queue has been shuffled`));
  return client.log(message);
}

module.exports.code = {
  title: "shuffle",
  about: "Shuffle the queue",
  usage: ["%P% loop"],
}