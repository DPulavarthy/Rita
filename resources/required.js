const end = (name) => {
    console.error(`[START_UP:ENV:ERROR]`.red, `Missing (${name}) in the .env file!`);
    return process.exit(1);
}

module.exports = () => {
    for (const name of [ "TOKEN" ]) {
        if(!process.env[name]) end(name);
    }
};