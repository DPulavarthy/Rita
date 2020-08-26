module.exports.run = async (client, message) => {
    let cmds = (require(`../../data/text/counts.json`).cmds + 1).toLocaleString();
    let embed = client.embed()
        .setAuthor(`About ${client.user.tag}`)
        .setDescription(`I am a Discord bot make to serve and only respond to [${client.owner.tag}](${client.util.owner.link})\nI have served ${client.owner.username} ${cmds} times!`)
        .setImage(`https://i.imgur.com/xakVjck.webp`)
    return message.channel.send(embed);
}

module.exports.code = {
    title: "about",
    about: "About %B%",
    usage: ["%P% about"],
}