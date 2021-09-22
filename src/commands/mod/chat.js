const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'chat',
            description: 'Ative/desative um chat.',
            options: [
              {
                name: 'modo',
                type: 'BOOLEAN',
                description: 'Use "true" para atiavar e "false" para desativar o chat.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {
      const config = require('../../../config.json')

      var erro = new MessageEmbed()
      .setColor(config.cores.vermelho)
      .setDescription(`${config.emojis.errado} | ${interaction.member}, para executar esse comando é necessario permissão.`)
      .setFooter(`Permissão: Gerenciar mensagens.`)

  if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ embeds: [erro] });

  var ativarOuDesativar = interaction.options.getBoolean('modo')
  
  if(ativarOuDesativar === true) {

    ativarOuDesativar = 'ativado'
    
    var cargo = interaction.guild.roles.cache.find(r => r.name === "@everyone")
    
    interaction.channel.permissionOverwrites.edit(cargo, {
      
      SEND_MESSAGES: true
      
    })
    
    var a = new MessageEmbed()
    .setColor(config.cores.verde)
    .setDescription(`${config.emojis.certo} | Canal ativado.`)
    .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
    
    interaction.channel.send({ embeds: [a] }).then((i) => {
      setTimeout(() => {
        if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
      }, 15000)
    })
    interaction.reply({ content: `Canal alterado para ${ativarOuDesativar}`, ephemeral: true })
    
  }
  
  if(ativarOuDesativar === false) {

    ativarOuDesativar = 'desativado'
    
    var cargo = interaction.guild.roles.cache.find(r => r.name === "@everyone")

    interaction.channel.permissionOverwrites.edit(cargo, {
      
      SEND_MESSAGES: false
      
    })
    
    var a = new MessageEmbed()
    .setColor(config.cores.vermelho)
    .setDescription(`${config.emojis.errado} | Canal desativado.`)
    .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
    interaction.reply({ content: `Canal alterado para ${ativarOuDesativar}`, ephemeral: true })
    interaction.channel.send({ embeds: [a] }).then((i) => {
      setTimeout(() => {
        if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
      }, 15000)
    })
    
  }
    }
}

exports.config = {
  
  name: "chat",
  description: "Comando para ativar e desativar canais.",
  example: "<prefix>chat [true | false]",
  category: "Moderação"
  
}