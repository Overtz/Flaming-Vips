const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')


module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            description: 'Use este comando para disilenciar um membro.',
            options: [
              {
                name: 'usuário',
                type: 'USER',
                description: 'Usuário que será disilenciado.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {

      const config = require('../../../config.json')
      const clientColor = interaction.guild.me.displayHexColor
      const muteTimeSchema = require('../../database/models/mute-time-schema')

      try {

        const erro1 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, você não tem permissão para executar esse comando.`)
          .setFooter(`Permissão: Gerenciar mensagens.`)
        
  
        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ embeds: [erro1], ephemeral: true });

        const erro2 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, eu não tenho permissão para executar esse comando.`)
          .setFooter(`Permissão: Gerenciar cargos.`)
        
        if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({ embeds: [erro2], ephemeral: true });
        
        const user = interaction.options.getMember('usuário')

        const muteTimeData = await muteTimeSchema.findOne({ userID: user.id })

        const erro3 = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`❌ | ${interaction.member}, esse membro não está mutado.`)
        if(!muteTimeData) return interaction.reply({ embeds: [erro3], ephemeral: true });
        
        var cargo = interaction.guild.roles.cache.find(r => r.name === "Mutado")
    
        if(!cargo) {
          cargo = await interaction.guild.roles.create({name: "Mutado", color: "#2f3136", permissions: []})
        }
        
       if (muteTimeSchema.findOneAndDelete({ userID: member.id })) {
        
       user.roles.remove(cargo, `Desmutado por: ${interaction.member.user.tag}`)
        
        var a = new MessageEmbed()
        .setColor(config.cores.verde) 
        .setDescription(`${config.emojis.certo} | Membro desmutado com sucesso.`)
        .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
        
        interaction.reply({ embeds: [a] }).then((i) => {
          setTimeout(() => {
            if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
          }, 15000)
        })
        
        
        var logs = new MessageEmbed()
        .setColor(clientColor)
        .setAuthor(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
        .setDescription(`**Ação**: \`Unmute\`\n**Membro**: \`${user.user.tag}\` - \`${user.user.id}\``)
        .setTimestamp()
        
        var channel = interaction.guild.channels.cache.get(config.canais.mod)
        if(!channel) return;
        
        channel.send({ embeds: [logs] })
       }
      } catch (error) {
        console.log('erro Unmute ', error)
      }
    }
}

module.exports.config = {
  name: "unmute",
  description: "Comando para desmutar membros.",
  example: "<prefix>unmute [@User]",
  category: "Moderação"
}