const { Schema, model } = require('mongoose')

const vipConfigSchema = new Schema({
    serverID: { type: String, require: true, unique: true },

    vipLogChannel: { type: String, require: true, default: 'none' },
    vipAnnounceamentChannel: { type: String, require: true, default: 'none' }
})

module.exports = model('vip-config', vipConfigSchema)