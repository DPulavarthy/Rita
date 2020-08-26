module.exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id), member = message.guild.members.cache.get(message.author.id);
  if (!queue) return message.channel.send(client.comment(`There is nothing playing.`));
  if (member.voice.channel !== member.guild.me.voice.channel) return message.channel.send(client.comment(`You need to be in the same voice channel as the bot!`));
  switch (!queue.playing) {
    case true: {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      queue.textChannel.send(client.comment(`Resumed the music!`));
      break;
    }
    default: { message.channel.send(client.comment(`The queue is not paused.`)); break; }
  }
}

module.exports.code = {
  title: "resume",
  about: "Resumes the queue",
  usage: ["%P% resume"],
  alias: ["res"],
}