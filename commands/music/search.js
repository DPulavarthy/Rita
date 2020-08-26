module.exports.run = async (client, message, args) => {
  let YouTubeAPI = require(`simple-youtube-api`), youtube = new YouTubeAPI(client.util.key.google);
  if (!args.length) return client.src.invalid(message);
  if (message.channel.activeCollector) return message.channel.send(client.comment(`A message collector is already active in this channel.`));
  if (!message.member.voice.channel) return message.channel.send(client.comment(`You need to join a voice channel first!`));
  let resultsEmbed = client.embed().setTitle(`**Reply with the song number you want to play**`).setDescription(`Results for: ${args.join(` `)}`)
  try {
    let results = await youtube.searchVideos(args.join(` `), 10);
    results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));
    let resultsMessage = await message.channel.send(resultsEmbed);
    function filter(msg) { let pattern = /(^[1-9][0-9]{0,1}$)/g; return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10; }
    message.channel.activeCollector = true;
    let response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: [`time`] }), choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
    message.channel.activeCollector = false;
    message.client.commands.get(`play`).run(client, message, [choice]);
    return resultsMessage.delete().catch(console.error);
  } catch (error) { console.error(error); return message.channel.activeCollector = false; };
}

module.exports.code = {
  title: "search",
  about: "Searches for a track",
  usage: ["%P% search"],
  alias: ["find"],
}