module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { return client.src.invalid(message); };
    message.channel.startTyping(true);
    let alexa = require(`alexa-bot-api`);
    let owo = false;
    if (args[0].toLowerCase() === `owo`) { args.shift(); owo = !owo; };
    new alexa(client.util.key.alexa).getReply(args.join(` `)).then(reply => { return message.channel.send(`> ${args.join(` `)}\n${owo ? require(`owofi`)(reply) : reply}`); });
}

module.exports.code = {
    title: "ask",
    about: "%B% as a chatbot",
    usage: ["%P% chat [TEXT]"],
    alias: ["chat"],
}