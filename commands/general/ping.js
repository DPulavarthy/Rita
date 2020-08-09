module.exports.run = async (client, message) => {
    let word, loading = await message.channel.send(client.src.loading()), load = loading.createdTimestamp - message.createdTimestamp, args = message.content.trim().split(/ +/g);
    args.splice(0, client.prefix.split(` `).length);
    switch (args[0].toLowerCase()) { case `ding`: word = `🛎️ Dong!`; break; case `beep`: word = `🐉 Boop!`; break; default: word = `🏓 Pong!` };
    setTimeout(async () => { loading.edit(client.embed().setDescription(`${client.src.code(word)}${client.src.code(`Latency is ${load} ms\nAPI Latency is ${Math.round(client.ws.ping)} ms\nServer Latency is ${message.channel.type === `dm` ? `not avaliable in DMs` : `${Math.round(message.guild.shard.ping)} ms`}`, `js`)}`)); }, 1000);
    return client.log(message);
}

module.exports.code = {
    title: "ping",
    about: "Latency + API Latency + Server Latency",
    usage: ["%P% ping", "%P% beep", "%P% ding"],
    alias: ["beep", "ding"],
}