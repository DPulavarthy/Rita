module.exports = async (song, message) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!song) { queue.channel.leave(); message.client.queue.delete(message.guild.id); return queue.textChannel.send(message.client.comment(`${String.fromCodePoint(128683)} Music queue ended.`)).catch(console.error); };
  let stream = null, streamType = song.url.includes(`youtube.com`) ? `opus` : `ogg/opus`;
  try { stream = await require(`ytdl-core-discord`)(song.url, { highWaterMark: 1 << 25 }); }
  catch (error) {
    if (queue) { queue.songs.shift(); module.exports(queue.songs[0], message); };
    console.error(error);
    return message.channel.send(`Error: ${error.message ? error.message : error}`);
  }
  queue.connection.on(`disconnect`, () => message.client.queue.delete(message.guild.id));
  const dispatcher = queue.connection
    .play(stream, { type: streamType })
    .on(`finish`, () => {
      if (queue.loop) { let lastSong = queue.songs.shift(); queue.songs.push(lastSong); module.exports(queue.songs[0], message); }
      else { queue.songs.shift(); module.exports(queue.songs[0], message); };
    })
    .on(`error`, (err) => { console.error(err); queue.songs.shift(); module.exports(queue.songs[0], message); });
  dispatcher.setVolumeLogarithmic(queue.volume / 100);
  queue.textChannel.send(`Now Playing: **\`${song.title}\`** ${song.url}`);
}
