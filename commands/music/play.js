module.exports.run = async (client, message, args) => {
  let YouTubeAPI = require(`simple-youtube-api`), youtube = new YouTubeAPI(client.util.key.google), { channel } = message.member.voice, serverQueue = message.client.queue.get(message.guild.id);
  if (!channel) return message.channel.send(client.comment(`You need to join a voice channel first.`));
  if (serverQueue && channel !== message.guild.me.voice.channel) return message.channel.send(client.comment(`You must be in the same channel as ${client.user.usernmae}`));
  if (!args.length) return client.src.invalid(message);
  let permissions = channel.permissionsFor(message.client.user);
  if (!permissions.has(`CONNECT`)) return message.channel.send(client.comment(`Cannot connect to voice channel, missing permissions`));
  if (!permissions.has(`SPEAK`)) return message.channel.send(client.comment(`I cannot speak in this voice channel, make sure I have the proper permissions!`));
  let videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi, playlistPattern = /^.*(list=)([^#\&\?]*).*/gi, url = args[0], urlValid = videoPattern.test(args[0]);
  if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) { return playlist(); } else { player(); };
  async function player() {
    let queueConstruct = { textChannel: message.channel, channel, connection: null, songs: [], loop: false, volume: 100, playing: true }, songInfo = null, song = null;
    if (urlValid) {
      try {
        songInfo = await require(`ytdl-core`).getInfo(url);
        song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, duration: songInfo.videoDetails.lengthSeconds };
      } catch (error) { console.error(error); return message.channel.send(client.comment(`ERROR`).setDescription(client.src.code(error.message))); }
    } else {
      try {
        const results = await youtube.searchVideos(args.join(` `), 1);
        songInfo = await require(`ytdl-core`).getInfo(results[0].url);
        song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, duration: songInfo.videoDetails.lengthSeconds };
      } catch (error) { console.error(error); message.channel.send(client.comment(`No video was found with a matching title`)); return client.log(message); }
    }
    if (serverQueue) { serverQueue.songs.push(song); return serverQueue.textChannel.send(client.comment(`${song.title} has been added to the queue`)); };
    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);
    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      require(`../../resources/play.js`)(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      message.channel.send(client.comment(`Could not join the channel: ${error}`));
    }
    return client.log(message);
  }
  async function playlist() {
    let pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi, urlValid = pattern.test(args[0]), queueConstruct = { textChannel: message.channel, channel, connection: null, songs: [], loop: false, volume: 100, playing: true }, song = null, playlist = null, videos = [];
    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(args[0], { part: "snippet" });
        videos = await playlist.getVideos(25, { part: "snippet" });
      } catch (error) { console.error(error); message.channel.send(client.comment(`Playlist not found`)); return client.log(message); };
    } else {
      try {
        const results = await youtube.searchPlaylists(args.join(` `), 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(25, { part: "snippet" });
      } catch (error) { console.error(error); message.channel.send(client.comment(`Playlist not found`)); return client.log(message); };
    }
    videos.forEach((video) => {
      song = { title: video.title, url: video.url, duration: video.durationSeconds };
      if (serverQueue) { serverQueue.songs.push(song); } else { queueConstruct.songs.push(song); };
    });
    let playlistEmbed = client.embed().setTitle(playlist.title).setURL(playlist.url);
    playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
    if (playlistEmbed.description.length >= 2048) playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";
    message.channel.send(playlistEmbed);
    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct)
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        require(`../../resources/play.js`)(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        message.channel.send(client.comment(`Could not join the channel: ${error}`));
      }
    }
    return client.log(message);
  }
}

module.exports.code = {
  title: "play",
  about: "Plays a track",
  usage: ["%P% play"],
  alias: ["p"],
}