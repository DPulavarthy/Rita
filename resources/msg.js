module.exports = async (message, time) => {
    if (message.author.id !== message.client.owner.id) return;
    if (message.content.toLowerCase() === `${message.client.user.username.toLowerCase()}?` || (message.channel.type !== `dm` && message.content.toLowerCase() === `${message.guild.members.cache.get(message.client.user.id).displayName.toLowerCase()}?`)) { return message.channel.send(`**${message.client.user.username} online, serving ${message.client.owner.username} with prefix \`${message.client.prefix}\`**`); };
    if (message.content === `(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B`) { return message.channel.send(`\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)`); };
    if (message.content.toLowerCase().startsWith(message.client.prefix)) {
        let args = message.content.trim().split(/ +/g);
        args.splice(0, message.client.prefix.split(` `).length);
        if (args[0]) {
            let command = message.client.commands.get(args[0].toLowerCase()) || message.client.commands.get(message.client.aliases.get(args[0].toLowerCase()));
            if (command) {
                try { args.shift(); command.run(message.client, message, args).then(async () => { message.channel.stopTyping(true); message.client.log(message, time); }) } catch (error) { return message.channel.send(client.comment(`There was an error trying to execute that command: ${error}`)); };
                let counts = require(`../data/text/counts.json`);
                if (command.code.title === `help`) { counts.help++; };
                counts.cmds++;
                require(`fs`).writeFile(`./data/text/counts.json`, JSON.stringify(counts), 'utf8', function (error) { if (error) { message.channel.send(message.client.comment(`ERROR: ${error}`)); }; });
                delete require.cache[require.resolve(`../data/text/counts.json`)];
            }
        }
    }
}