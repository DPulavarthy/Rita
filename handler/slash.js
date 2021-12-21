module.exports = class Slash {
    /**
     * @param {import('discord.js').Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async run(interaction) {
        if(interaction.isCommand()) {
            let command = this.client.commands.get(interaction.commandName),
                uId = interaction.member?.user?.id ?? interaction.user?.id;
            if(!command) return;

            let cmd = await command.run(interaction);
            return cmd;
        }
    }
};