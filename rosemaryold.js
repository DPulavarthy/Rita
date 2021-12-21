require('dotenv').config()

Array.exists = i => Array.isArray(i) && i.some(e => e)
Object.mergify = (m, ...s) => { s.map(o => Object.keys(o).map(k => m[k] = o[k])); return m }

const [{ Client, Collection, Intents: { FLAGS }, Options: { cacheWithLimits } }, { messageCreate, interactionCreate }, src] = ['discord.js', './resources/events.js', './resources/src.js'].map(m => require(m))

class Rosemary extends Client {
    constructor() {
        super({
            restTimeOffset: 100,
            intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'].map(i => FLAGS[i]),
            makeCache: cacheWithLimits({ MessageManager: { maxSize: 200, sweepInterval: 5 * 60000 } })
        })

        src.load(this)

        Object.mergify(this, { src, commands: new Collection() })

        this
            .on('ready', src.startup)
            .on('messageCreate', messageCreate)
            .on('interactionCreate', interactionCreate)
            .login(process.env.TOKEN)
    }  
}

global.client = new Rosemary()
