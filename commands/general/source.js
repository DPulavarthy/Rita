module.exports.run = async (client, message) => {
    let repo = require(`../../package.json`).repository.src;
    let embed = client.embed()
        .setAuthor(`Source for ${client.user.tag}`)
        .setDescription(`**Link to the GitHub Repository**\n\u279c ${repo}`)
        .setImage(`https://i.imgur.com/H1aB73F.png`)
    return message.channel.send(embed);
}

module.exports.code = {
    title: "source",
    about: "GitHub Source Link",
    usage: ["%P% source"],
}