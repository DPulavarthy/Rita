module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) return client.src.invalid(message);
    if (args.join(` `).toLowerCase().startsWith(client.prefix)) { args.splice(0, client.prefix.split(` `).length); };
    let command = client.commands.get(args.join(` `)) || client.commands.get(client.aliases.get(args.join(` `)));
    if (command) {
        let field = [];
        field.push(`Group: ${command.group.substring(0, 1).toUpperCase()}${command.group.substring(1)}`);
        field.push(`Description: ${client.src.clean(command.code.about)}`);
        field.push(`Aliases: ${command.code.alias ? `<${client.prefix} ${command.code.alias.join(`> <${client.prefix} `)}>` : `N/A`}`);
        field.push(`**\`Usage\`**${command.code.usage ? `\n${client.src.clean(command.code.usage.join(`\n`))}` : `: N/A`}`);
        let embed = client.embed()
            .setAuthor(`Command: ${command.code.title.substring(0, 1).toUpperCase()}${command.code.title.substring(1)}`)
            .setDescription(field.join(`\n`))
            .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
        return message.channel.send(embed);
    } else { return client.src.invalid(message); };
}

module.exports.code = {
    title: "explain",
    about: "Gives a better description of a command's usage",
    usage: ["%P% explain"],
    alias: ["e"],
}