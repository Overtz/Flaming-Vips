const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'editvip',
            description: 'Faça eu falar algo por você em embed.',
            options: [
              {
                name: 'usuário',
                type: 'USER',
                description: 'Usuário que terá seu vip.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {

        if (interaction.member.id !== '434353523065487360') return interaction.reply({ content: 'Este comando ainda está sendo feito.', ephemeral: true });

    }
}