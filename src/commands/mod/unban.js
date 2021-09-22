const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            description: 'Use este comando para desbanir um membro.',
            options: [
              {
                name: 'id',
                type: 'STRING',
                description: 'ID do usuário a ser desbanido.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {

      const config = require('../../../config.json')
      const clientColor = interaction.guild.me.displayHexColor

      const erro1 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, você não tem permissão para executar esse comando.`)
          .setFooter(`Permissão: Banir membros.`)

      try {
        if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ embeds: [erro1], ephemeral: true });

        const erro2 = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`${config.emojis.errado} | ${interaction.member}, eu não tenho permissão para executar esse comando.`)
        .setFooter(`Permissão: Banir membros.`)
        
        if(!interaction.guild.me.permissions.has("BAN_MEMBERS")) interaction.reply({ embeds: [erro2], ephemeral: true })

        const user = interaction.options.getString('id')

         const erro = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, esse membro não está banido.`)
        
        var banveri = await interaction.guild.bans.fetch({ user, cache: false }).catch((error) => {
          if (error.code == 10026) {
            interaction.reply({ embeds: [erro], ephemeral: true })
          } else {
            console.log(error)
          }
        })
       

        if (banveri) {
        
        if (interaction.guild.members.unban(user)) {

        var a = new MessageEmbed()
        .setColor(config.cores.verde)
        .setDescription(`${config.emojis.certo} | Membro desbanido com sucesso.`)
        .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
        
        interaction.reply({ embeds: [a] }).then((i) => {
          setTimeout(() => {
            if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
          }, 15000)
        })
        
        var logs = new MessageEmbed()
        .setColor(clientColor)
        .setAuthor(`Autor: ${interaction.member.tag}`, interaction.member.user.avatarURL())
        .setDescription(`**Ação**: \`Unban\`\n**Membro**: \`${user.username}\` - \`${user}\``)
        .setTimestamp()
        
        var channel = interaction.guild.channels.cache.get(config.canais.mod)
        if(!channel) return;
        
        channel.send({ embeds: [logs] })
        }
        }
      } catch (error) {
        console.log('erro UnBan.js ', error)
      }
    }
}

module.exports.config = {
  name: "unban",
  description: "Comando para desbanir membros.",
  example: "<prefix>unban [@User]",
  category: "Moderação"
}