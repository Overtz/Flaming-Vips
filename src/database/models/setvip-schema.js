const { Schema, model } = require('mongoose')

const setvipSchema = new Schema({
    userID: { type: String, require: true, unique: true },
    setUser: { type: String, require: true, unique: false },
    serverID: { type: String, require: true, unique: false },
    roleID: { type: String, require: true, unique: false },
    channelID: { type: String, require: true, unique: true },
    time: { type: String, require: true }
})

module.exports = model('vips-data', setvipSchema)