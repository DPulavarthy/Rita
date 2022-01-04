/**
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 */

 module.exports = async (client, message) => {
    let clientMatch = new RegExp(`<@!?${client.user.id}>`, "gi");
    if (!message.content.match(clientMatch)) return null;
    let args = message.content.replace(clientMatch, "").trim().split(/ +/g),
        name = args[0]?.toLowerCase();
        
    let command = client.devcommands.get(name) || client.devcommands.find(c => c.code?.alias?.includes?.(name));
    if (!command) return null;
    return command.run(client, message, args.slice(1))
}