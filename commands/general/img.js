module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) return client.src.invalid(message);
    let key = args[0].toUpperCase();
    args.shift();
    switch (key) {
        case `HELP`:
            let field = [];
            field.push(`${client.prefix} ${module.exports.code.title} save`);
            field.push(`${client.prefix} ${module.exports.code.title} delete`);
            field.push(`${client.prefix} ${module.exports.code.title} get`);
            field.push(`${client.prefix} ${module.exports.code.title} list`);
            message.channel.send(client.embed().setDescription(client.src.code(field.join(`\n`))));
            break;
        case `SAVE`:
            switch (!args.join(` `) || !message.attachments.first()) {
                case true: client.src.invalid(message); break;
                default:
                    let names = [];
                    for await (let file of require(`fs`).readdirSync(`./data/images`)) { names.push(file); };
                    if (names.includes(`${args.join(` `)}.png`)) { message.channel.send(client.comment(`A file with that name already exists`)); return client.log(message); };
                    require(`node-fetch`)(message.attachments.first().url).then(res => new Promise((resolve, reject) => {
                        const dest = require(`fs`).createWriteStream(`./data/images/${args.join(` `)}.png`);
                        res.body.pipe(dest);
                        dest.on('close', () => resolve());
                        dest.on('error', reject);
                    }));
                    message.channel.send(client.comment(`Image saved`));
                    break;
            }
            break;
        case `DELETE`:
            switch (!args.join(` `)) {
                case true: client.src.invalid(message); break;
                default:
                    let names = [];
                    for await (let file of require(`fs`).readdirSync(`./data/images`)) { names.push(file); };
                    if (!names.includes(`${args.join(` `)}.png`)) { message.channel.send(client.comment(`A file with that name does not exist`)); return client.log(message); };
                    require(`fs`).unlinkSync(`./data/images/${args.join(` `)}.png`);
                    message.channel.send(client.comment(`Image deleted`));
                    break;
            }
            break;
        case `GET`:
            switch (!args.join(` `)) {
                case true: client.src.invalid(message); break;
                default:
                    let names = [], Discord = require(`discord.js`);
                    for await (let file of require(`fs`).readdirSync(`./data/images`)) { names.push(file); };
                    if (!names.includes(`${args.join(` `)}.png`)) { message.channel.send(client.comment(`A file with that name does not exist`)); return client.log(message); };
                    message.channel.send({ files: [new Discord.MessageAttachment(`./data/images/${args.join(` `)}.png`)], embed: client.comment(`${args.join(` `)}.png`).setImage(`attachment://${args.join(`_`).replace(/[()]/g, ``)}.png`) });
                    break;
            }
            break;
        case `LIST`:
            let names = [], groups = [], msg = await message.channel.send(client.comment(`Image list`).setDescription(`\"⬅️\" and \"➡️\" to navigate`)), i = 0;
            for await (let file of require(`fs`).readdirSync(`./data/images`)) { names.push(file); };
            if (names.length < 1) { return msg.edit(client.comment(`No Images Found`)); };
            while (names.length > 0) groups.push(names.splice(0, 10));
            if (groups.length < 2) {
                let field = [], j = 1;
                groups[0].forEach(file => { field.push(`\`${j}.)\` ${file}`); j++; });
                msg.edit(client.comment(`Image list`).setDescription(field.join(`\n`)));
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
                    msg.edit(client.comment(`Image list [${i}/${groups.length}]`).setDescription(field.join(`\n`)));
                });
                setTimeout(async () => { msg.reactions.removeAll(); collector.stop(); }, groups.length * 30 * 1000);
            }
            break;
    }
    return client.log(message);
}

module.exports.code = {
    title: "img",
    about: "Image options",
    usage: ["%P% img help"],
    alias: ["image"],
}