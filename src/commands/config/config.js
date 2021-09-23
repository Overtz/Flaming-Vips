const Command = require('../../structures/Command')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'config',
            description: 'Configurar dados do servidor no bot.',
            options: [
                {
                    type: 'SUB_COMMAND_GROUP',
                    name: 'vip_log',
                    description: 'Configuração do sistema de logs.',
                    options: [
                        {
                            type: 'SUB_COMMAND',
                            name: 'canal_vip_log',
                            description: 'Configurar o canal onde vips entregues serão enviados.',
                            options: [
                                {
                                    type: 'CHANNEL',
                                    name: 'canal',
                                    description: 'Canal de texto onde as mensagens serão enviadas.',
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND_GROUP',
                    name: 'vip_announce',
                    description: 'Configuração do sistema de anúncio de vip\'s',
                    options: [
                        {
                            type: 'SUB_COMMAND',
                            name: 'canal_vip_announce',
                            description: 'Configurar o canal onde anúncios de vips entregues serão enviados.',
                            options: [
                                {
                                    type: 'CHANNEL',
                                    name: 'canal',
                                    description: 'Canal de texto onde as mensagens serão enviadas.',
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }

    run = async (interaction) => {
        if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.reply({ content: 'Você não tem permissão para utilizar este comando!', ephemeral: true })

        const subCommandGroup = interaction.options.getSubcommandGroup()
        const subCommand = interaction.options.getSubcommand()

        require(`../../subCommands/config/${subCommandGroup}/${subCommand}`)(this.client, interaction)
    }
}