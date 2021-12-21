module.exports = class Ping extends require('#base') {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'A ping command',
            options: [{ name: 'option', description: 'Ping command options', type: 'STRING', required: false, choices: ['ping', 'beep', 'ding'].map(c => ({ name: c, value: c })) }]
        })
    }

    async run(interaction) {
        let [time, option] = [new Date(), { ping: '\uD83C\uDFD3 Pong!', beep: '\uD83D\uDC09 Boop!', ding: '\uD83D\uDECE\uFE0F Dong!' }[interaction.options.getString('option', false) || 'ping']]

        interaction.reply({ content: option, ephemeral: true }).catch(console.error)

        // switch (interaction.options.getString('option', false)) {
        //     case 'beep': {
        //         interaction.reply({ content: 'Boop', ephemeral: true }).catch(console.error)
        //         break
        //     }
        //     case 'ding': {
        //         interaction.reply({ content: 'Dong', ephemeral: true }).catch(console.error)
        //         break
        //     }
        //     default: {
        //         interaction.reply({ content: 'Pong', ephemeral: true }).catch(console.error)
        //         break
        //     }
        // }
    }
}