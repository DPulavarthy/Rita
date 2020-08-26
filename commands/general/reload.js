module.exports.run = async (client, message, args) => {
    switch (!args.join(` `)) {
        case true:
            let list = [];
            for await (let command of client.commands) { list.push(command[1]); }
            let j = 1;
            let i = 1;
            let loading = await message.channel.send(client.embed().setAuthor(`Reloading: ${i}/${list.length} commands`));
            list.forEach(async cmd => {
                setTimeout(async () => {
                    let command = client.commands.get(cmd.code.title);
                    let name = command.code.title, dir = command.group, reloading = `./commands/${dir}/${name}.js`;
                    loading.edit(client.embed().setAuthor(`Reloading: ${i}/${list.length} commands`).setDescription(`Reloading: \`${name}.js\``));
                    delete require.cache[require.resolve(`../.${reloading}`)];
                    client.commands.delete(name);
                    const pull = require(`../.${reloading}`);
                    client.commands.set(name, { run: pull.run, code: pull.code, group: dir });
                    i++;
                    setTimeout(async () => {
                        if ((i - 1) < list.length) { loading.edit(client.embed().setAuthor(`Reloading: ${i}/${list.length} commands`).setDescription(`**Reloaded: \`${name}.js\`**`)); }
                        else { loading.edit(client.embed().setAuthor(`Reloaded: ${list.length} commands`).setDescription(`${body.join(`\n`)}`)); };
                    }, 1000);
                }, j * 5 * 1000);
                j++;
            })
            break;
        default:
            let input = args.join(` `).toLowerCase();
            let command = client.commands.get(input) || client.commands.get(client.aliases.get(input));
            if (command) {
                let name = command.code.title, dir = command.group, reloading = `./commands/${dir}/${command.code.title}.js`;
                let loading = await message.channel.send(client.embed().setDescription(`Reloading: \`${reloading}\``));
                delete require.cache[require.resolve(`../.${reloading}`)];
                client.commands.delete(name);
                const pull = require(`../.${reloading}`);
                client.commands.set(name, { run: pull.run, code: pull.code, group: dir });
                setTimeout(async () => { loading.edit(client.embed().setDescription(`**Reloaded: \`${reloading}\`**`)); }, 1000);
                break;
            } else {
                let groups = [];
                let reload = [];
                let i = 1;
                let j = 1;
                client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
                if (groups.includes(input)) {
                    client.commands.forEach(command => { if (command.group === input && !reload.includes(command.code.title)) { reload.push(command.code.title); }; });
                    let loading = await message.channel.send(client.embed().setAuthor(`Reloading: ${i}/${reload.length} commands`));
                    let body = [];
                    for await (let cmd of reload) {
                        setTimeout(async () => {
                            let command = client.commands.get(cmd), name = command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title, reloading = `./commands/${input}/${name}.js`;
                            body.push(`Reloading: \`${name}.js\``);
                            loading.edit(client.embed().setAuthor(`Reloading: ${i}/${reload.length} commands`).setDescription(body.join(`\n`)));
                            delete require.cache[require.resolve(`../.${reloading}`)];
                            client.commands.delete(name);
                            const pull = require(`../.${reloading}`);
                            client.commands.set(name, { run: pull.run, code: pull.code, group: input });
                            body.pop();
                            body.push(`**Reloaded: \`${name}.js\`**`)
                            i++;
                            setTimeout(async () => {
                                if ((i - 1) < reload.length) { loading.edit(client.embed().setAuthor(`Reloading: ${i}/${reload.length} commands`).setDescription(`${body.join(`\n`)}`)); }
                                else { loading.edit(client.embed().setAuthor(`Reloaded: ${reload.length} commands`).setDescription(`${body.join(`\n`)}`)); };
                            }, 1000);
                        }, j * 5 * 1000);
                        j++;
                    }
                } else { message.channel.send(client.src.comment(`That command file or group does not exist.`)); };
            }
            break;
    }
}

module.exports.code = {
    title: "reload",
    about: "reload command to accept new changes",
    usage: ["%P%reload [COMMAND]"],
}