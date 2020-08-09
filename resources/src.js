let client;
module.exports = {
    startup(input, time) {
        client = input;
        client.queue = new Map();
        client.src = require(`./src.js`);
        client.util = require(`./util.js`);
        client.prefix = process.env.PREFIX;
        client.token = process.env.TOKEN;
        client.comment = client.src.comment;
        client.embed = client.src.embed;
        client.log = client.src.log;
        client.owner = client.users.cache.get(client.util.owner.id);
        setInterval(() => { client.user.setActivity(client.owner.tag, { type: `WATCHING` }); }, 3600000);
        console.log(`[PROGRM]: ${client.user.tag} Connection Successful! [${((new Date().getTime() - time) / 1000).toFixed(2)}s]`.yellow);
    },
    log(message) { return console.log(`[INFORM]: ${message.content}`.brightMagenta); },
    code(input, type) { return `\`\`\`${type ? type : ``}\n${input}\n\`\`\``; },
    clean(input) { return input.replace(/%B%/g, client.user.username).replace(/%P%/g, client.prefix); },
    embed() { let Discord = require(`discord.js`); return new Discord.MessageEmbed().setFooter(`Provided by: ${client.user.tag}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 })).setColor(client.util.main).setTimestamp(); },
    loading() { return client.comment(`Loading...`); },
    comment(input) { return client.embed().setTitle(`**\`${input}\`**`) },
    invalid(message) { message.channel.send(client.comment(`INVALID INPUT`)); return client.log(message); },
}