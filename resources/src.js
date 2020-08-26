let client;
module.exports = {
    startup(input, time) {
        client = input;
        client.queue = new Map();
        client.src = this;
        client.util = require(`./util.js`);
        client.prefix = process.env.PREFIX;
        client.token = process.env.TOKEN;
        client.comment = client.src.comment;
        client.embed = client.src.embed;
        client.log = client.src.log;
        client.owner = client.users.cache.get(client.util.owner.id);
        client.user.setActivity(client.owner.tag, { type: `WATCHING` });
        setInterval(() => { client.user.setActivity(client.owner.tag, { type: `WATCHING` }); }, 3600000);
        console.log(`[PROGRM]: [${((new Date().getTime() - time) / 1000).toFixed(2)}s] ${client.user.tag} Connection Successful!`.yellow);
    },
    log(message, time) { return console.log(`[INFORM]: [${((new Date().getTime() - time) / 1000).toFixed(2)}s] ${message.content}`.brightMagenta); },
    code(input, type) { return `\`\`\`${type ? type : ``}\n${input}\n\`\`\``; },
    error(input) { return console.log(`[ERROR!]: ${input}`.brightMagenta); },
    clean(input) { return input.replace(/%B%/g, client.user.username).replace(/%P%/g, client.prefix); },
    embed() { let Discord = require(`discord.js`); return new Discord.MessageEmbed().setFooter(`Provided by: ${client.user.tag}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 })).setColor(client.util.main).setTimestamp(); },
    loading() { return client.comment(`Loading...`); },
    comment(input) { return client.embed().setTitle(`**\`${input}\`**`) },
    invalid(message) { message.channel.send(client.comment(`INVALID INPUT`)); return client.log(message); },
    status(oldMember, newMember) {
        if (!oldMember) return;
        if (newMember.user.id !== client.owner.id) return;
        if (oldMember.status !== newMember.status) {
            let counts = require(`../data/text/counts.json`);
            counts.status = new Date().toISOString();
            require(`fs`).writeFile(`./data/text/counts.json`, JSON.stringify(counts), 'utf8', function (error) { if (error) { throw error; }; });
            delete require.cache[require.resolve(`../data/text/counts.json`)];
        }
    },
}