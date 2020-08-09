module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) return client.src.invalid(message);
    let key = args[0].toUpperCase();
    args.shift();
    switch (key) {
        case `HELP`:
            let field = [];
            field.push(`${client.prefix} ${module.exports.code.title} add`);
            field.push(`${client.prefix} ${module.exports.code.title} delete`);
            field.push(`${client.prefix} ${module.exports.code.title} get`);
            field.push(`${client.prefix} ${module.exports.code.title} edit`);
            field.push(`${client.prefix} ${module.exports.code.title} list`);
            message.channel.send(client.embed().setDescription(client.src.code(field.join(`\n`))));
            break;
        case `ADD`:
            switch (!args.join(` `) || !args[1]) {
                case true: client.src.invalid(message); break;
                default:
                    let data = { case: args[0], data: args.slice(1).join(` `) }, tags = require(`../../data/text/tag.json`);
                    if (tags.data.find(tag => tag.case === args[0])) { message.channel.send(client.comment(`A tag with that case already exists`)); return client.log(message); };
                    tags.data.push(data);
                    require(`fs`).writeFile(`./data/text/tag.json`, JSON.stringify(tags), 'utf8', function (error) { if (error) { message.channel.send(client.comment(`ERROR: ${error}`)); } else { message.channel.send(client.comment(`Tag added!`)); }; });
                    delete require.cache[require.resolve(`../../data/text/tag.json`)];
                    break;
            }
            break;
        case `DELETE`:
            switch (!args.join(` `)) {
                case true: client.src.invalid(message); break;
                default:
                    let tags = require(`../../data/text/tag.json`);
                    if (!tags.data.find(tag => tag.case === args[0])) { message.channel.send(client.comment(`A tag with that case does not exist`)); return client.log(message); };
                    tags = tags.data.filter(tag => tag.case !== args[0]);
                    require(`fs`).writeFile(`./data/text/tag.json`, JSON.stringify({ data: tags }), 'utf8', function (error) { if (error) { message.channel.send(client.comment(`ERROR: ${error}`)); } else { message.channel.send(client.comment(`Tag deleted!`)); }; });
                    delete require.cache[require.resolve(`../../data/text/tag.json`)];
                    break;
            }
            break;
        case `GET`:
            switch (!args.join(` `)) {
                case true: client.src.invalid(message); break;
                default:
                    let tags = require(`../../data/text/tag.json`), exists = tags.data.find(tag => tag.case === args[0]);
                    if (!exists) { message.channel.send(client.comment(`A tag with that case does not exist`)); return client.log(message); };
                    message.channel.send(client.comment(exists.data).setAuthor(`Tag: ${exists.case}`))
                    delete require.cache[require.resolve(`../../data/text/tag.json`)];
                    break;
            }
            break;
        case `EDIT`:
            switch (!args.join(` `) || !args[1]) {
                case true: client.src.invalid(message); break;
                default:
                    let tags = require(`../../data/text/tag.json`);
                    if (!tags.data.find(tag => tag.case === args[0])) { message.channel.send(client.comment(`A tag with that case does not exist`)); return client.log(message); };
                    tags = tags.data.filter(tag => tag.case !== args[0]);
                    tags.push({ case: args[0], data: args[1] });
                    require(`fs`).writeFile(`./data/text/tag.json`, JSON.stringify({ data: tags }), 'utf8', function (error) { if (error) { message.channel.send(client.comment(`ERROR: ${error}`)); } else { message.channel.send(client.comment(`Tag Edited!`)); }; });
                    delete require.cache[require.resolve(`../../data/text/tag.json`)];
                    break;
            }
            break;
        case `LIST`:
            let names = [], groups = [], msg = await message.channel.send(client.comment(`Tag list`).setDescription(`\"⬅️\" and \"➡️\" to navigate`)), i = 0;
            for await (let tag of require(`../../data/text/tag.json`).data) { names.push(tag.case); };
            if (names.length < 1) { msg.edit(client.comment(`No Tags Found`)); break; };
            while (names.length > 0) groups.push(names.splice(0, 10));
            if (groups.length < 2) {
                let field = [], j = 1;
                groups[0].forEach(file => { field.push(`\`${j}.)\` ${file}`); j++; });
                msg.edit(client.comment(`Tag list`).setDescription(field.join(`\n`)));
            } else {
                await msg.react(`⬅️`);
                await msg.react(`➡️`);
                let filter = (reaction, user) => [`⬅️`, `➡️`].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);
                collector.on('collect', async (reaction) => {
                    reaction.users.remove(message.author.id);
                    if (reaction.emoji.name === `⬅️`) { if (i <= 1) return; i--; };
                    if (reaction.emoji.name === `➡️`) { if (i === groups.length) return; i++; };
                    let field = [], j = ((i - 1) * 10) + 1;
                    groups[i - 1].forEach(file => { field.push(`\`${j}.)\` ${file}`); j++; });
                    msg.edit(client.comment(`Tag list [${i}/${groups.length}]`).setDescription(field.join(`\n`)));
                });
                setTimeout(async () => { msg.reactions.removeAll(); collector.stop(); }, groups.length * 30 * 1000);
            }
            break;
    }
    return client.log(message);
}

module.exports.code = {
    title: "tag",
    about: "Tag options",
    usage: ["%P% tag help"],
}