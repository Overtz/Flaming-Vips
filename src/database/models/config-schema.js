const { Schema, model } = require('mongoose')

const configSchema = new Schema({
    _id: { type: String, require: true, unique: true },

        ticketCatego: { type: String, default: "644610468790403072" },
        giftCatego: { type: String, default: "644610468790403072" },

        ticketChannel: { type: String, default: "644610081433845815" },
        captchaChannel: { type: String, default: "644607936928284674" },
        welcomeChannel: { type: String, default: "751489359152152616" },
        logsChannel: { type: String, default: "751489456837492882" },
        formChannel: { type: String, default: "860907657190440980" },
        modLogsChannel: { type: String, default: "644609326316650526" },
})

module.exports = model('server-config', configSchema)