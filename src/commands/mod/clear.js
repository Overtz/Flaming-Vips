const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            description: 'Apague mensagens com este comando.',
            options: [
              {
                name: 'quantidade',
                type: 'NUMBER',
                description: 'Escolha um número entre 1 e 100 de mensagens a serem apagadas.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {
      const config = require('../../../config.json')

      try {
     
       var erro = new MessageEmbed()
       .setColor(config.cores.vermelho)
       .setDescription(`${config.emojis.errado} | ${interaction.member}, para executar esse comando é necessario permissão.\n\n**Permissão**: \`Administrador\`.`)
       if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ embeds: [erro], ephemeral: true });
     
       const quantidade = interaction.options.getNumber('quantidade')
       
       var lixo = parseInt(quantidade, 10)
     
       const erro2 = new MessageEmbed()
         .setColor(config.cores.vermelho)
         .setDescription(`${config.emojis.errado} | ${interaction.member}, insira uma quantia entre 1 e 100.`)
     
       if(!lixo) return interaction.reply({ embeds: [erro2], ephemeral: true })
     
       const erro3 = new MessageEmbed()
         .setColor(config.cores.vermelho)
         .setDescription(`${config.emojis.errado} | ${interaction.member}, insira uma quantia entre 1 e 100.`)
       
       if(lixo < 1) return interaction.reply({ embeds: [erro3], ephemeral: true });
       
     
       const erro4 = new MessageEmbed()
         .setColor(config.cores.vermelho)
         .setDescription(`${config.emojis.errado} | ${interaction.member}, insira uma quantia entre 1 e 100.`)
     
       if(lixo > 99) return interaction.reply({ embeds: [erro4], ephemeral: true });
       
       var msg = await interaction.channel.messages.fetch({
                 limit: lixo + 1
               });
       interaction.channel.bulkDelete(msg).catch(async e => {
         
         var erro4 = new MessageEmbed()
         .setColor(config.cores.vermelho)
         .setDescription(`${config.emojis.errado} | Ocorreu algum erro!`)
     
         if(e) {
           return interaction.reply({ embeds: [erro4], ephemeral: true });
         }
         
       })
       
       var a = new MessageEmbed()
       .setColor(config.cores.verde)
       .setDescription(`${config.emojis.certo} | Foram apagadas ${lixo} mensagens.`)
       .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
     
       interaction.reply({ embeds: [a] }).then((i) => {
        setTimeout(() => {
          if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
        }, 15000)
      })
      } catch (error) {
        console.log('erro Clear.js', error)
      }
    }
}

module.exports.config = {
  name: "clear",
  description: "Comando para limpar mensagens.",
  example: "<prefix>clear [Quantia entre 1 e 100]",
  category: "Moderação"
  
}