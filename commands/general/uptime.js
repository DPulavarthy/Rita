let moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message) => {
    let field = [];
    field.push(`${client.user.username} has been ${client.user.presence.status} for ${moment.duration(new Date().getTime() - new Date(client.readyAt).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`);
    field.push(`${client.owner.username} has been ${client.owner.presence.status} for ${moment.duration(new Date().getTime() - new Date(require(`../../data/text/counts.json`).status).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`);
    return message.channel.send(client.embed().setDescription(client.src.code(field.join(`\n`))));
}

module.exports.code = {
    title: "uptime",
    about: "Uptime of %B%",
    usage: ["%P% uptime"],
    alias: ["up"],
}