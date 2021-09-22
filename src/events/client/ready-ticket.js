const Event = require('../../structures/Event')

const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async () => {
        const client = this.client
        const config = require('../../../config.json')
        const configSchema = require('../../database/models/config-schema')
        const configData = await configSchema.findOne({ _id: '644597677417299989' })
        const ticketCountSchema = require('../../database/models/ticket-count')
        const guild = await client.guilds.cache.get('644597677417299989')

        var totalTickets;
        var openTickets;
    
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('openTicket-880852772851957770')
                .setPlaceholder('Selecione um método de ajuda.')
                .addOptions([
                  {
                      label: 'Dúvidas',
                      emoji: '📫',
                      value: 'duvidas'
                  },
                  {
                    label: 'Solicitar Tag (Vip/YT)',
                    emoji: '🏦',
                    value: 'parceiros'
                  },
                  {
                    label: 'Problemas com compras',
                    emoji: '<a:esmeraldaA:884220964144054333>',
                    value: 'compras'
                  },
                  {
                    label: 'Denúncias',
                    emoji: '🚨',
                    value: 'denuncias'
                  },
                  {
                    label: 'Revisões de Punições',
                    emoji: '📋',
                    value: 'revisoes'
                  },
                  {
                    label: "Bug Report's",
                    emoji: '<:alerta:862029315789160480>',
                    value: 'bugs'
                  }
                ]),
        )

        if (configData) {
            setInterval( async () => {
                const ticketCountData = await ticketCountSchema.findOne({ _id: guild.id })

                if (!ticketCountData) {
                    totalTickets = 0;
                    openTickets = 0;
                } else {
                    totalTickets = ticketCountData.openTicketCount
                    openTickets = ticketCountData.totalTicketCount
                }

                if (!configData) return;
                if (!ticketCountData) return;
        
                const configChannel = configData.ticketChannel
                const canalToSend = guild.channels.cache.get(configChannel)

                const embedToSend = new MessageEmbed()
                .setColor(guild.me.displayHexColor)
                .setTitle('TICKETS')
                .setDescription(`
                Seja bem-vindo a central de atendimento da Rede Vicio.
                Caso queira solicitar atendimento, selecione uma categoria de suporte específica. Seu atendimento será por meio de um __canal privado__, onde apenas você e Staff's tem acesso.
                
                \`\`Caso haja abuso deste Sistema, poderá haver punições\`\``)
                .addField('Departamentos:', '\n📫 - Dúvidas\n🏦 - Solicitar Tag (Vip/YT)\n<a:esmeraldaA:884220964144054333> - Problemas com compras\n🚨 - Denúncias\n📋 - Revisões de Punições\n<:alerta:862029315789160480> - Bug Report\'s', true)
                .addField('Tickets', `Tickets Abertos: ${openTickets}\nTickets Totais: ${totalTickets}`, true)
                .addField('Horário de Atendimento:', '⏲️``10:00 às 20:00 (UTC -3)``', true)

                if (!canalToSend) return;

                const msg = canalToSend.messages.resolveId(ticketCountData.messageID)
                const getMessage = canalToSend.messages.fetch(ticketCountData.messageID).catch((error) => {
                    if (error.code == 10008) {

                    } else {
                        console.error
                    }
                })

                if (msg) {
                    if (getMessage) {
                    await canalToSend.messages.fetch(ticketCountData.messageID).then( async (message) => {
                        await message.delete() 
                        const mensagem = await canalToSend.send({ embeds: [embedToSend], components: [row] })

                        await ticketCountSchema.findOneAndUpdate({ _id: guild.id }, { 
                            messageID: mensagem.id
                            }, {
                                upsert: true
                            })
                        await console.log('Mensagem Enviada com sucesso!')
                    }).catch((error) => {
                        if (error.code == 10008) {
                            console.log('Mensagem não encontrada!')
                        } else {
                            console.error
                        }
                    })
                    } else {
                        console.log('Mensagem não encontrada.')
                    }
                }
            }, 1000 * 60 * 60 * 12)
        }
    }
}