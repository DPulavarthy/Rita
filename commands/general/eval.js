module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) return client.src.invalid(message);
    let loading = await message.channel.send(client.src.loading());
    for (let word of [`api`, `env`, `key`, `token`]) {
        if (args.join(` `).includes(word)) return result(`ERROR: You do not want to do this!\nA word has triggered the eval command to terminate!\nWord: ${word}`, false, `xl`);
    }
    try {
        let evaled = clean(await eval(args.join(` `)));
        if (evaled.length > (1900 - args.join(` `).length)) evaled = `${evaled.substring(0, (1900 - args.join(` `).length))}...`;
        return result(evaled, true);
    } catch (error) { console.log(`${`[EVALER]: ${error}`.red}`); return result(error); };
    function result(output, status, format) {
        setTimeout(function () {
            let embed = client.embed()
                .setDescription(`**Input**\n${client.src.code(args.join(` `))}\n**Output**\n${client.src.code(output, format || `js`)}`)
                .addField(`\u200b`, `**Status**: ${status ? `Success` : `Failed`}`)
            return loading.edit(embed);
        }, 1000);
    };
    function clean(text) {
        if (typeof text !== `string`) text = require(`util`).inspect(text, { depth: 0 });
        return text
            .replace(/`/g, `\`` + String.fromCharCode(8203))
            .replace(/@/g, `@` + String.fromCharCode(8203))
            .replace(new RegExp(client.token, "gi"), `[DENIED]`)
    };
}

module.exports.code = {
    title: "eval",
    about: "Evaluates [CODE]",
    usage: ["%P% eval [CODE]"],
}