const vipConfigSchema = require('../../../database/models/vip-config-schema')

module.exports = async (client, interaction) => {

    const canal = interaction.options.getChannel('canal')
    const vipConfigData = await vipConfigSchema.findOne({ serverID: interaction.guild.id })
    
    if (!vipConfigData) {
        await vipConfigSchema.create({
            serverID: interaction.guild.id,
            vipAnnounceamentChannel: canal.id
        })
    }
    if (vipConfigData) {
        await vipConfigSchema.findOneAndUpdate({ serverID: interaction.guild.id }, {
            vipAnnounceamentChannel: canal.id
        })
    }

    interaction.reply({ content: `Canal de Anúnciamento alterado para: <#${canal.id}>, com sucesso!`, ephemeral: true })
}