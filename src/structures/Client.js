const { Client } = require('discord.js')

const { readdirSync } = require('fs')
const { join } = require('path')

const config = require('../../config.json')

const { connect } = require('mongoose')
const Models = require('../database/models/Models')

module.exports = class extends Client {
    constructor(options) {
        super(options)

        this.commands = []
        this.loadCommands()
        this.loadEvents()
    }

    registryCommands() {
        // temporária
        this.guilds.cache.get('644597677417299989').commands.set(this.commands) // 644597677417299989
        //this.application.commands.set(this.commands)
    }

    loadCommands(path = 'src/commands') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)

            for (const command of commands) {
                const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`))
                const cmd = new (commandClass)(this)

                this.commands.push(cmd)
            }
        }
    }

    loadEvents(path = 'src/events') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const events = readdirSync(`${path}/${category}`)

            for (const event of events) {
                const eventClass = require(join(process.cwd(), `${path}/${category}/${event}`))
                const evt = new (eventClass)(this)

                this.on(evt.name, evt.run)
            }
        }
    }

    async connectToDatabase() {
        const connection = await connect(config.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Database conectada com sucesso!')

        this.db = { connection, ...Models }
    }
}