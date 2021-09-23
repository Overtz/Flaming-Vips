const { Schema, model } = require('mongoose')

const setvipSchema = new Schema({
    userID: { type: String, require: true, unique: true },
    setUser: { type: String, require: true, unique: false },
    serverID: { type: String, require: true, unique: false },
    roleID: { type: String, require: true, unique: false },
    time: { type: String, require: true }
})

module.exports = model('vips-data', setvipSchema)