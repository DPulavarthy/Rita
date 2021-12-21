let client;
module.exports = {
    async startup(input) {
        client = input[0];
        console.log(`${`[PROGRM]: ${client.user.tag} Connection Successful!`.yellow}`);
    }
}