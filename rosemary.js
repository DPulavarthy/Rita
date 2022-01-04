require('dotenv').config()

Array.exists = i => Array.isArray(i) && i.some(e => e)
Object.mergify = (m, ...s) => { s.map(o => Object.keys(o).map(k => m[k] = o[k])); return m }

const [{ Client, Intents: { FLAGS }, Options: { cacheWithLimits } }, { readdirSync }] = ['discord.js', 'fs'].map(m => require(m))

require("colors");
class Rosemary extends Client {
    constructor() {
        super({
            restTimeOffset: 100,
            intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'].map(i => FLAGS[i]),
            makeCache: cacheWithLimits({ MessageManager: { maxSize: 200, sweepInterval: 5 * 60000 } })
        })
        for (let event of readdirSync(`./events`)) this.on(event.replace(/\.js/g, ''), (...params) => new (require(`./events/${event}`))(this, ...params))
        this.login(process.env.TOKEN).catch(error => { throw new ReferenceError(error) })
    }
}

global.Client = new Rosemary()