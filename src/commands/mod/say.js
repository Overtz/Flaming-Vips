const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            description: 'Faça eu falar algo por você.',
            options: [
              {
                name: 'conteúdo',
                type: 'STRING',
                description: 'Conteúdo da fala.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {

      const config = require('../../../config.json')

      var erro = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`${config.emojis.errado} | ${interaction.member}, para executar esse comando é necessario permissão.\n\n**Permissão**: \`Gerenciar Mensagens\`.`)

      if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ embeds: [erro], ephemeral: true });

      const conteudo = interaction.options.getString('conteúdo')

      interaction.reply({ content: 'Mensagem enviada com sucesso!', ephemeral: true })
      
      interaction.channel.send({ content: `${conteudo}` })
    }
}

module.exports.config = {
  name: "say",
  description: "Faça eu falar algo por você.",
  example: "<prefix>say [Conteudo].",
  category: "Moderação"
  
}