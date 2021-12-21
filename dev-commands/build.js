/**
 * @param {import("discord.js").Message} message 
 */
module.exports.run = async (client, message) => {
    if(message.content.match(/removeall/gi)) {
        if (message.content.match(/guild/gi)) await message.guild.commands.set([]).catch(console.error)
        else await message.client.application.commands.set([]).catch(console.error);
        return message.reply({ content: "Done" })
    }
    let commands = message.client.commands;
    let data = [];
    for (const command of commands.values()) {
        if(!command.build) continue;
        data.push(command.build())
    }

    if(message.content.match(/global/gi)) {
        if(!message.client.application) return message.reply({ content: `There is no client.application?` }).catch(() => {});
        let res = await message.client.application.commands.set(data).catch(e => e);
        if(res instanceof Error) return message.reply(res.stack).catch(() => {});
        return message.reply({ content: `Deploying (**${data.length.toLocaleString()}**) slash commands, this could take up to 1 hour` }).catch(() => {});
    }
    let res = await message.guild.commands.set(data).catch(e => e);
    if(res instanceof Error) return message.reply(res.stack).catch(() => {});
    return message.reply({ content: `Deploying (**${data.length.toLocaleString()}**) slash commands` }).catch(() => {});
};

module.exports.code = {
    title: "build",
    about: `Build the slash commands`,
    alias: [],
    usages: [
        `\`build\` - Build Server Commands`,
        `\`build global\` - Build Global Commands`,
        `\`build removeall\` - Remove Global Commands`,
        `\`build guild removeall\` - Remove Server Commands`
    ]
}