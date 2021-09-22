const { Schema, model } = require('mongoose')

const setvipTimeSchema = new Schema({
    userID: { type: String, require: true, unique: true },
    serverID: { type: String, require: true, unique: false },
    time: { type: String, require: true }
})

module.exports = model('vips-data', setvipTimeSchema)