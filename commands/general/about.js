module.exports.run = async (client, message) => {
    message.channel.send(client.embed().setAuthor(`About ${client.user.tag}`).setDescription(`I am a Discord bot make to serve and only respond to [${client.owner.tag}](${client.util.owner.link})\nI have served ${client.owner.username} ${(require(`../../data/text/counts.json`).cmds + 1).toLocaleString()} times!`).setImage(`https://i.imgur.com/VgOq6cv.jpg`));
    return client.log(message);
}

module.exports.code = {
    title: "about",
    about: "About %B%",
    usage: ["%P% about"],
}