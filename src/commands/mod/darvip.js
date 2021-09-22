const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'darvip',
            description: 'Faça eu falar algo por você em embed.',
            options: [
              {
                name: 'tempo',
                type: 'STRING',
                description: 'Tempo que o membro ficará com o vip.',
                required: true
              },
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

      const config = require('../../../config.json');
      const ms = require('ms')
      const setvipTimeSchema = require('../../database/models/setvip-time-schema')

      try {
        // if(!message.member.roles.some(r => ["🚀│Moderador", "📌│Admin"].includes(r.name))) return;

        const erro1 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, para executar esse comando é necessario permissão.`)
          .setFooter(`Permissão: Gerenciar cargos`)

        if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({ embeds: [erro1], ephemeral: true });
    
        const user = interaction.options.getMember('usuário')
        var time = interaction.options.getString('tempo')

        const erro4 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, você errou o formato do tempo.`)
          .setFooter(`Formato: 1s, 1m, 1h ou 1d`)
    
        var cargo = interaction.guild.roles.cache.find(r => r.name == "💲│VIP")

        const erro2 = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`${config.emojis.errado} | ${interaction.member}, o cargo \`💲│VIP\` não existe.`)

        if (!cargo) return interaction.reply({ embeds: [erro2], ephemeral: true });

        const erro3 = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`${config.emojis.errado} | ${interaction.member}, o membro mencionado já é vip.`)
        
        if (user.roles.cache.has(cargo.id)) return interaction.reply({ embeds: [erro3], ephemeral: true });

        var tempo;
          if (time == 'perm') {
            time = 'Permanente.'
            tempo = 'perm'
          } else {
            tempo = ms(time)
            const setVipOnDB = await setvipTimeSchema.create({
              userID: user.id,
              serverID: interaction.guild.id,
              time: Date.now() + tempo
            })
          }
    
        if (!tempo) return interaction.reply({ embeds: [erro4], ephemeral: true });
        
        user.roles.add(cargo, `Vip setado por: ${interaction.member.user.tag}`)

        const embedLog = new MessageEmbed()
        .setTitle('VIP LOG')
        .setColor(interaction.guild.me.displayHexColor)
        .setThumbnail(user.user.displayAvatarURL())
        .addField('Usuário que recebeu:', `${user}`)
        .addField('Quem setou:', `<@${interaction.member.id}>`)
        .addField('Tempo:', `${time}`)

        const log = interaction.guild.channels.cache.get('644609326316650526')
        await log.send({ embeds: [embedLog] })
        
        var a = new MessageEmbed()
        .setColor(config.cores.verde)
        .setDescription(`${config.emojis.certo} | Tag VIP setado com sucesso.\n\n**Membro**: ${user}\n**Tempo**: ${time}`)
        .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL())
        
        interaction.reply({ embeds: [a] }).then((i) => {
          setTimeout(() => {
            if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
          }, 15000)
        })
        
    
      } catch (error) {
        console.log('erro SetarVip.js ', error)
      }
    }
}

module.exports.config = {

  name: "darvip",
  description: "Comando para setar vip.",
  example: "<prefix>darvip",
  category: "Moderação"
  
}