module.exports = class Ready {
    constructor(client) {
        Object.mergify(this, client)

        this.load()
        this.log()
    }

    load() {
        this._src = require('../resources/src.js')()
        this._commands = require('../resources/handler.js')()
    }

    log() {
        console.log(`${client.user?.tag ?? 'Client'} successfully connected.`)
    }
}