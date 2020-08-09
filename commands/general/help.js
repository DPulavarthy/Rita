module.exports.run = async (client, message) => {
    let commands = [], groups = [], final = [];
    client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
    groups.forEach(group => { let field = []; client.commands.forEach(command => { if (command.group === group) { field.push(`\`${client.prefix}\` ${command.code.title}`); }; }); commands.push({ case: group, data: field }); });
    commands.forEach(set => { final.push(`**\`${set.case.toUpperCase()}\`**\n${set.data.join(`\n`)}\n`); })
    message.channel.send(client.embed().setAuthor(`${client.user.username}'s help list`).setDescription(`\`${client.owner.username}, I have given you this list ${(require(`../../data/text/counts.json`).help + 1).toLocaleString()} times...\`\n\n${final.join(`\n`)}`))
    return client.log(message);
}

module.exports.code = {
    title: "help",
    about: "Help list",
    usage: ["%P% help"],
}