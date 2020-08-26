module.exports.run = async (client, message) => {
    let loading = await message.channel.send(client.src.loading());

    require(`systeminformation`).cpu().then(cpu => {
        let embed = client.embed()
            .setAuthor(`Debugging`)
            .addField(`Client Tag`, client.src.code(client.user.tag), true)
            .addField(`Client ID`, client.src.code(client.user.id), true)
            .addField(`Processing memory`, client.src.code(formatBytes(process.memoryUsage().rss)), true)
            .addField(`Discord.JS Version`, client.src.code(`v${require(`discord.js`).version}`), true)
            .addField(`Node.JS Version`, client.src.code(process.version), true)
            .addField(`Client Version`, client.src.code(`v${require(`../../package.json`).version}`), true)
            .addField(`WS Ping`, client.src.code(`${client.ws.ping}ms`), true)
            .addField(`Server Info`, client.src.code(`Raspberry Pi`), true)
            .addField(`Server Cores`, client.src.code(cpu.cores), true)
            .addField(`Last Updated`, client.readyAt.toDateString(), true)
            .addField(`Serving`, `\`${client.owner.tag}\``, true)
        return setTimeout(async () => { await loading.edit(embed); }, 1000);
    })

    function formatBytes(bytes) {
        if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(2)} GB`;
        else if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(2)} MB`;
        else if (bytes >= 1000) return `${(bytes / 1000).toFixed(2)} KB`;
        else if (bytes > 1 || bytes < 1)`${bytes} bytes`;
        else return `1 byte`;
    }
}

module.exports.code = {
    title: "debug",
    about: "Debugging/Processing Information",
    usage: ["%P% debug"],
}