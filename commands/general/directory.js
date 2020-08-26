module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) return client.src.invalid(message);
    let input = args.join(` `).toLowerCase();
    let package = require(`../../package.json`);
    if (args.join(` `).toLowerCase().startsWith(client.prefix)) args.splice(0, client.prefix.split(` `).length);
    let command = client.commands.get(input) || client.commands.get(client.aliases.get(input));
    if (command) return embed(`./commands/${command.group}/${command.code.title}.js`);
    else {
        let resources = require(`fs`).readdirSync(`./resources`).filter(file => file.split(`.`).pop() === `js`);
        if (resources.includes(`${input}.js`)) { return embed(`./resources/${input}.js`); }
        else if ([package.main.substring(0, package.main.length - 3), `index`].includes(input)) { return embed(`./${package.main}`); }
        else {
            let groups = [];
            let field = [];
            let i = 1;
            client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
            if (groups.includes(input)) {
                client.commands.forEach(command => {
                    if (command.group === input) {
                        field.push(`\`${i}.)\` ${command.code.title}.js`);
                        i++;
                    };
                });
                return message.channel.send(client.embed().setAuthor(`Commands in the ${input} group`).setDescription(field.join(`\n`)));
            }
            else if (input === `commands`) {
                groups.forEach(group => { field.push(`\`${i}.)\` ${group}`); i++; });
                return message.channel.send(client.embed().setAuthor(`Command groups`).setDescription(field.join(`\n`)));
            }
            else return message.channel.send(client.comment(`ERROR: That JS file was not found in any directory.`));
        };
    };
    function embed(dir) { return message.channel.send(client.embed().setAuthor(`The directory for \`${args.join(` `)}\` is`).setTitle(`**\`${dir}\`**`)); };
}

module.exports.code = {
    title: "directory",
    about: "Get the directoy of a file/command",
    usage: ["%P% directory"],
    alias: ["dir"],
}