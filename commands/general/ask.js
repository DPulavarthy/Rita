module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { return client.src.invalid(message); }
    message.channel.startTyping(true);
    let alexa = require(`alexa-bot-api`), ai = new alexa(client.util.key.alexa);
    ai.getReply(args.join(` `)).then(reply => { message.channel.send(reply); });
    message.channel.stopTyping(true);
    return client.log(message);
}

module.exports.code = {
    title: "ask",
    about: "%B% as a chatbot",
    usage: ["%P% chat [TEXT]"],
    alias: ["chat"],
}