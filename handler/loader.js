const fs = require("fs");

module.exports = async (client) => { // Command Handler
    let [count, approved, broken] = [0, 0, []];
    console.log(`[SYSTEM]: Loading Commands!`.brightGreen);
    fs.readdirSync(`./commands/`).forEach(async dir => {
        if([ "base.js", "build.js" ].includes(dir)) return;
        const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.split(`.`).pop() === `js`);
        for (let file of commands) {
            try {
                let pull = require(`../commands/${dir}/${file}`);
                if(pull?.constructor?.name !== "Function") continue;
                pull = new pull(client);
                if(pull.filters?.length) {
                    if(pull.filters.includes("guild") && pull.filters.includes("dms")) throw new Error(`You can't have 'guild' & 'dms' at the same time for command filters! | ${pull.constructor.name} | ../commands/${dir}/${file}`)
                }
                if (pull.command?.name) {
                    pull.group = dir;
                    client.commands.set(pull.command.name, pull);
                    count++; approved++;
                } else { 
                    count++; 
                    broken.push(file); 
                    continue; 
                }
            } catch (err) {
                console.error(err);
                continue;
            }
        }
    });
    console.log(`${`[SYSTEM]: Successfully Loaded ${approved}/${count} Commands!`.brightGreen}${broken.length > 0 ? `\n[ERROR!]: Failed To Load: ${broken.join(`, `)}`.red : ``}`);
}