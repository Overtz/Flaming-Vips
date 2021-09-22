const Command = require('../../structures/Command')

const configSchema = require('../../database/models/config-schema')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'configuracoes',
            description: 'Staff Command.'
        })
    }
    
    run = async (interaction) => {

        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Você não tem permissão para executar este comando!', ephemeral: true })

        if (!interaction.guild.me.permissions.has('ADMNISNTRATOR')) return interaction.reply({ content: 'Eu não tenho permissão para executar este comando!', ephemeral: true })

        const embedToSend = new MessageEmbed()
        .setTitle('⚙️ | Configuração do Servidor')
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(`
        Seja bem-vindo a página de configuração do servidor, oque deseja ver?`)
        .addField('Opções:', '📊 - Categorias\n📡 - Canais')
        .setTimestamp()

        const msg = await interaction.reply({ embeds: [embedToSend], fetchReply: true })

        await msg.react('📊')
        await msg.react('📡')

        const filter = (reaction, user) => {
            return ['📊', '📡'].includes(reaction.emoji.name) && user.id === interaction.member.id
        }

        const collector = msg.createReactionCollector({ filter, time: 60000 })
        collector.on('collect', async (reaction, user) => {
            const configData = await configSchema.findOne({ _id: interaction.guild.id })
            if (reaction.emoji.name === '📊') {

                const embed = new MessageEmbed()
                .setTitle('📊 | Categorias')
                .setColor(interaction.guild.me.displayHexColor)
                .addField('✉️ Ticket', `${configData.ticketCatego}`)
                .addField('🎁 Gift', `${configData.giftCatego} *Não alteravél por comando até o momento*`)
                .setFooter('Use /config para alterar as configurações.')

                msg.edit({ content: `<@${interaction.member.id}>`, embeds: [embed] })
                msg.reactions.removeAll()
                setTimeout(() => {
                    if (msg.reactions.cache.get('📊')) { 
                        msg.reactions.cache.get('📊').remove();
                      }
                      if (!msg.reactions.cache.get('📡')) {
                        msg.react('📡')
                      }
                }, 2000)
            }

            if (reaction.emoji.name === '📡') {
                
                const embed = new MessageEmbed()
                .setTitle('📡 | Canais')
                .setColor(interaction.guild.me.displayHexColor)
                .addField('✉️ Ticket', `${configData.ticketChannel}`)
                .addField('🛡️ Captcha', `${configData.captchaChannel}`)
                .addField('🎉 Entrada', `${configData.welcomeChannel}`)
                .addField('🗄️ Logs', `${configData.logsChannel} *Não alteravél por comando até o momento*`)
                .addField('📋 Formulários', `${configData.formChannel} *Não alteravél por comando até o momento*`)
                .addField('🗃️ ModLogs', `${configData.modLogsChannel} *Não alteravél por comando até o momento*`)
                .setFooter('Use /config para alterar as configurações.')

                msg.edit({ content: `<@${interaction.member.id}>`, embeds: [embed] })
                msg.reactions.removeAll()
                setTimeout(() => {
                    if (msg.reactions.cache.get('📡')) { 
                        msg.reactions.cache.get('📡').remove();
                      }
                      if (!msg.reactions.cache.get('📊')) {
                        msg.react('📊')
                      }
                }, 2000)
            }
        })
    }
}