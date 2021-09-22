const Event = require('../../structures/Event')
const ticketCategories = require('../../util/ticketCategories')
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
const ticketCountSchema = require('../../database/models/ticket-count')
const config = require('../../../config.json')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        })
    }
    run = async (interaction) => {
        if (interaction.isCommand()) {
            if (!interaction.guild) return
            const cmd = this.client.commands.find(c => c.name === interaction.commandName)
            if (cmd) {

                cmd.run(interaction)
            }
        } else if (interaction.isSelectMenu()) {
            if (interaction.customId.startsWith('openTicket')) {

                const ticketCountData = await ticketCountSchema.findOne({ _id: interaction.guild.id })

                var ticketOpen = 1;
                var ticketTotal = 1;

                var categoria;

                if (interaction.values == 'duvidas') {
                    categoria = 'Dúvidas.'
                } else if (interaction.values == 'parceiros') {
                    categoria = 'Solicitar Tag'
                } else if (interaction.values == 'compras') {
                    categoria = 'Problema com compras.'
                } else if (interaction.values == 'denuncias') {
                    categoria = 'Denúncias.'
                } else if (interaction.values == 'revisoes') {
                    categoria = 'Revisões de Punições.'
                } else if (interaction.values == 'bugs') {
                    categoria = 'Bug Report\'s'
                }

                if (ticketCountData) {
                    await ticketCountSchema.findOneAndUpdate({ _id: interaction.guild.id }, { 
                    $inc: {
                      openTicketCount: ticketOpen, 
                      totalTicketCount: ticketTotal
                   },
                   messageID: interaction.message.id
                   }, {
                       upsert: true
                   })
                } else {
                    await ticketCountSchema.create({ _id: interaction.guild.id, messageID: interaction.message.id })
                }

                const channel = await interaction.guild.channels.create(`${categoria}-${interaction.user.tag}`, {
                    type: 'GUILD_TEXT',
                    parent: '644610468790403072',
                    topic: `ticket-${categoria}-${interaction.user.id}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: interaction.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'EMBED_LINKS', 'ADD_REACTIONS']
                        },
                        {
                            id: '645616462341472267',
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'EMBED_LINKS', 'ADD_REACTIONS']
                        }
                    ]
                })

                interaction.reply({ content: `Seu ticket foi aberto com sucesso no canal ${channel.toString()}!`, ephemeral: true })

                const deleteButton = new MessageButton()
                    .setLabel('Fechar ticket')
                    .setEmoji('❌')
                    .setCustomId('closeTicket')
                    .setStyle('DANGER')
                const row = new MessageActionRow().addComponents(deleteButton)
                
                const embedToSend = new MessageEmbed()
                .setTitle(`Ticket de ${interaction.member.user.tag}`)
                .setColor(config.cores.verde)
                .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`
                Seja bem-vindo ao Sistema de Suporte, você está requisitando suporte sobre: ${categoria}.
        
                <@&644613363770458123> <@&644613302147743755> <@&644613157418958848> <@&644600206419165254>
        
                Aguarde até que alguém lhê responda. *Não marque nenhum staff*`)
                .setTimestamp()

                const msg = await channel.send({ content: interaction.user.toString(), embeds: [embedToSend], components: [row] })

                const filter = (i) => i.guild.id === interaction.guild.id
                const collector = channel.createMessageComponentCollector({ filter })

                collector.on('collect', async (i) => {

                if (i.customId === 'closeTicket') {
                    await msg.edit({
                        content: `${msg.content}`,
                        embeds: [embedToSend],
                        components: [
                            new MessageActionRow().addComponents(msg.components[0].components[0].setDisabled())
                        ]
                    })
    
                    await channel.send({ content: 'O ticket será fechado em 10 segundos.', reply: { messageReference: msg.id } })
                    await ticketCountSchema.findOneAndUpdate({ _id: interaction.guild.id }, {
                        $inc: {
                            openTicketCount: -1
                        }
                    })
    
                    return setTimeout(() => channel.delete(), 10000);
                }
            })
            } 
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('captcha')) {

                if (interaction.member.roles.cache.has('645610465707163658')) return interaction.reply({ content: 'Você já foi verificado!' }).catch((error) => {
                    if (error.code == 500) {
                    } else {
                    console.log('erro interactionCreate.js', error)
                    }
                })

                interaction.reply({ content: 'Você foi verificado com sucesso!', ephemeral: true })
                interaction.member.roles.add('645610465707163658').catch((error) => {
                    if (error.code == 10011) { //anti-erro
                    } else {
                        console.error
                    }
                }) // 645610465707163658
                interaction.member.roles.remove('860902287424356353').catch((error) => {
                    if (error.code == 10011) {
                    } else {
                        console.error
                    }
                }) // 860902287424356353
            }
        }
    }
} 