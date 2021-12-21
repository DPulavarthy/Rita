require("dotenv").config();
require("colors");
require("./resources/required")();
const { Client, Collection, Intents: { FLAGS }, Options: { cacheWithLimits } } = require(`discord.js`),
    [messageCreate, interactionCreate] = [
        require("./events/message"),
        require("./events/interactionCreate")
    ]

class Meronpan extends Client {
    constructor() {
        super({
            intents: [
                FLAGS.GUILDS,
                FLAGS.GUILD_MEMBERS,
                FLAGS.GUILD_MESSAGES,
                FLAGS.GUILD_MESSAGE_REACTIONS
            ],
            restTimeOffset: 100, // Lowers the time needed for requests, for example reactions
            makeCache: cacheWithLimits({
                MessageManager: {
                    maxSize: 200,
                    sweepInterval: 5 * 60000
                }
            }),
            presence: {
                status: "dnd",
                activities: [
                    { name: "you", type: "WATCHING" }
                ]
            }
        })

        this.src = require("./resources/src")

        this.on("ready", () => this.src.startup([this]))
        this.on("messageCreate", m => messageCreate(this, m))
        this.on("interactionCreate", i => interactionCreate(this, i))

        for (const name of ["commands", "devcommands"]) this[name] = new Collection()
        for (const name of ["loader", "command"]) require(`./handler/${name}`)(this);

        this.login(process.env.TOKEN)
            .catch(e => this.error(`[DISCORD:CONNECTION:ERROR]: `.red, e));
    }
}

global.Client = new Meronpan()