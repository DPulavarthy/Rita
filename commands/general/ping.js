module.exports.run = async (client, message) => {
    let word;
    let loading = await message.channel.send(client.src.loading());
    let load = loading.createdTimestamp - message.createdTimestamp;
    let args = message.content.trim().split(/ +/g);
    args.splice(0, client.prefix.split(` `).length);
    switch (args[0].toLowerCase()) {
        case `ding`: {
            word = `${String.fromCodePoint(128276)} Dong!`;
            break;
        }
        case `beep`: {
            word = `${String.fromCodePoint(128009)} Boop!`;
            break;
        }
        case `ping`: {
            word = `${String.fromCodePoint(127955)} Pong!`;
            break;
        }
    }
    let field = [];
    field.push(`Latency is ${load} ms`);
    field.push(`API Latency is ${Math.round(client.ws.ping)} ms`);
    field.push(`Server Latency is ${message.channel.type === `dm` ? `not avaliable in DMs` : `${Math.round(message.guild.shard.ping)} ms`}`);
    let embed = client.embed()
        .setDescription(`${client.src.code(word)}${client.src.code(field.join(`\n`), `js`)}`)
    return setTimeout(async () => { loading.edit(embed); }, 1000);
}

module.exports.code = {
    title: "ping",
    about: "Latency + API Latency + Server Latency",
    usage: ["%P% ping", "%P% beep", "%P% ding"],
    alias: ["beep", "ding"],
}