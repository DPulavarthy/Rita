let SlashClient = require("../handler/slash")
module.exports = (client, i) => {
    let slash = new SlashClient(client);
    return slash.run(i);
}