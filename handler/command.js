const { readdirSync } = require("node:fs");

module.exports = async (client) => { // Command Handler
    let [ count, approved, broken ] = [
        ...new Array(4).fill(0),
        []
    ]
    console.log(`[SYSTEM]: Loading Dev Commands!`.brightGreen);
    readdirSync(`./dev-commands/`)
    .forEach(async file => {
        if (!file.endsWith(".js")) return;
        let pull = require(`../dev-commands/${file}`);
        if (pull.code?.title) {
            client.devcommands.set(pull.code.title, { run: pull.run, code: pull.code, group: "dev" });
            count++; approved++;
        } else { 
            count++; 
            broken.push(file); 
        }
    });
    console.log(`${`[SYSTEM]: Successfully Loaded Dev ${approved}/${count} Commands!`.brightGreen}${broken.length > 0 ? `\n[ERROR!]: Failed To Load: ${broken.join(`, `)}`.red : ``}`);
}