const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: 'Expulse membros com este comando.',
            options: [
              {
                name: 'usuário',
                type: 'USER',
                description: 'Usuário que será expulso.',
                required: true
              },
              {
                name: 'motivo',
                type: 'STRING',
                description: 'Motivo que o usuário será expulso.',
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
        .setFooter(`Permissão: Kickar membros.`)

      if(!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({ embeds: [erro1], ephemeral: true });

      const erro2 = new MessageEmbed()
        .setColor(config.cores.vermelho)
        .setDescription(`${config.emojis.errado} | ${interaction.member}, eu não tenho permissão para executar esse comando.`)
        .setFooter(`Permissão: Kickar membros.`)
      
      if(!interaction.guild.me.permissions.has("KICK_MEMBERS")) return interaction.reply({ embeds: [erro2], ephemeral: true });
      
      const user = interaction.options.getMember('usuário')
    
      const motivo = interaction.options.getString('motivo') || "Nenhum motivo informado.";

      if (!interaction.guild.members.resolve(user)) return interaction.reply({ content: 'Esse membro não se encontra no Servidor.', ephemeral: true });
    
      const roleUserHighestError = `${config.emojis.errado} | Você não pode expulsar um usuário com permissão maior que a sua.`;
      const roleClientHighestError = `${config.emojis.errado} | Não posso expulsar um usuário com permissão maior que a minha.`;
    
      if (interaction.member.roles.highest.position < user.roles.highest.position) return interaction.reply({ content: roleUserHighestError, ephemeral: true });
      
      if (interaction.guild.me.roles.highest.position < user.roles.highest.position) return interaction.reply({ content: roleClientHighestError, ephemeral: true });
      
      user.kick(`Expulso por: ${interaction.member.user.tag}, pelo motivo: ${motivo}`)
      
      var a = new MessageEmbed()
      .setColor(config.cores.verde)
      .setDescription(`${config.emojis.certo} | Membro kickado com sucesso.`)
      .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
      
      interaction.reply({ embeds: [a] }).then((i) => {
        setTimeout(() => {
          if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
        }, 15000)
      })
      
      var logs = new MessageEmbed()
      .setColor(clientColor)
      .setAuthor(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
      .setDescription(`**Ação**: \`Kick\`\n**Membro**: \`${user.user.tag}\` - \`${user.id}\`\n**Motivo**: \`${motivo}\``)
      .setTimestamp()
      
      var channel = interaction.guild.channels.cache.get(config.canais.mod)
      if(!channel) return;
      
      channel.send({ embeds: [logs] })
    }
}

exports.config = {
  name: "kick",
  description: "Comando para kickar membros.",
  example: "<prefix>kick [@User] [Motivo]",
  category: "Moderação"
}