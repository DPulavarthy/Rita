require('colors');
module.exports = async (client, time) => {
    let Discord = require(`discord.js`), count = 0, approved = 0, broken = [];
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    console.log(`[SYSTEM]: [${((new Date().getTime() - time) / 1000).toFixed(2)}s] Loading Commands!`.brightGreen);
    for await (let dir of require(`fs`).readdirSync(`./commands/`)) {
        const commands = require(`fs`).readdirSync(`./commands/${dir}/`).filter(file => file.split(`.`).pop() === `js`);
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.code && pull.code.title) {
                client.commands.set(pull.code.title, { run: pull.run, code: pull.code, group: dir });
                if (pull.code.alias && pull.code.alias.length > 0) { pull.code.alias.forEach(alias => { client.aliases.set(alias, pull.code.title); }); };
                count++; approved++;
            } else { count++; broken.push(file); continue; };
        }
    }
    console.log(`${`[SYSTEM]: [${((new Date().getTime() - time) / 1000).toFixed(2)}s] Successfully Loaded ${approved}/${count} Commands!`.brightGreen}${broken.length > 0 ? `\n[ERROR!]: Failed To Load: ${broken.join(`, `)}`.red : ``}`);
}