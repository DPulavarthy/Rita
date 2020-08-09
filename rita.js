let Discord = require(`discord.js`), client = new Discord.Client(), time = new Date().getTime();
require(`dotenv`).config();
require(`./resources/cmd.js`)(client);
client.on(`ready`, () => { require(`./resources/src.js`).startup(client, time); });
client.on(`message`, message => { require(`./resources/msg.js`)(message);    });
client.login(process.env.TOKEN);