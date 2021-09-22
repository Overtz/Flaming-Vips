const { MessageEmbed } = require('discord.js')

module.exports = async (client, interaction) => {
    const channel = interaction.options.getChannel('canal')
    const configSchema = require('../../../database/models/config-schema')
    const configData = await configSchema.findOne({ _id: interaction.guild.id })

    if (channel.type !== 'GUILD_TEXT') return interaction.reply({ content: 'Informe um canal de texto!', ephemeral: true })

    if (!configData) {
        configSchema.create({
            _id: interaction.guild.id,
            welcomeChannel: channel.id
        })
    } else {
        configSchema.findOneAndUpdate({
            _id: interaction.guild.id
        }, {
            welcomeChannel: channel.id
        })
    }
    
    interaction.reply({ content: 'Canal setado com sucesso!', ephemeral: true })
}