module.exports.run = async (client, message) => {
    let link = client.util.owner.playlist;
    client.commands.get(`play`).run(client, message, [link]);
}

module.exports.code = {
    title: "preset",
    about: "Preset Playlist Link",
    usage: ["%P% preset"],
}