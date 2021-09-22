const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'anuncio',
            description: 'Use para anunciar em um canal.',
            options: [
              {
                name: 'conteúdo',
                type: 'STRING',
                description: 'Conteúdo do anúncio que será enviado.',
                required: true
              }
            ]
        })
    }

    run = (interaction) => {
      
      const config = require('../../../config.json')

      if(!interaction.member.permissions.has("ADMINISTRATOR")) {
    
        const erro = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`${config.emojis.errado} | ${interaction.member}, para executar esse comando é necessario permissão.\n\n**Permissão**: \`Administrador\`.`)
        
        return interaction.reply({ embeds: [erro] })
      }
      
      const anunciar = interaction.options.getString('conteúdo')
      
      const embed = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .addField(`<a:sino:862043815836909619> Anúncio`, `${anunciar}`)
      .setFooter("Publicado por " + interaction.member.user.username, interaction.member.user.avatarURL())
      
      interaction.reply({ content: 'Anúncio enviado com sucesso!', ephemeral: true })

      interaction.channel.send({ embeds: [embed] })
      
        }
  }


module.exports.config = {
  name: "anúncio",
  description: "Faça um anúncio em embed.",
  example: "<prefix>anúncio [Conteudo].",
  category: "Moderação"
  
}