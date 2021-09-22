const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Use para banir um membro.',
            options: [
              {
                name: 'usuário',
                type: 'USER',
                description: 'Usuário a ser banido.',
                required: true
              },
              {
                name: 'motivo',
                type: 'STRING',
                description: 'Motivo que o Usuário que será banido.',
                required: false
              }
            ]
        })
    }
    
    run = async (interaction) => {
      const config = require('../../../config.json')

      try {
        // if(interaction.member.id !== "199239211390468109")
        if(!interaction.member.permissions.has("BAN_MEMBERS")) {
          
          const erro1 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, você não tem permissão para executar esse comando.`)
          .setFooter(`Permissão: Banir membros.`)
          
          interaction.reply({ embeds: [erro1], ephemeral: true })
        }
        
        if(!interaction.guild.me.permissions.has("BAN_MEMBERS")) {
          
          const erro2 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, eu não tenho permissão para executar esse comando.`)
          .setFooter(`Permissão: Banir membros.`)
          
          interaction.reply({ embeds: [erro2], ephemeral: true });
          
        };
    
        const user = interaction.options.getMember('usuário');
        const motivo = interaction.options.getString('motivo') || "Nenhum motivo informado.";
    
        const roleUserHighestError = `${config.emojis.errado} | Você não pode banir um usuário com permissão maior que a sua.`;
        const roleClientHighestError = `${config.emojis.errado} | Não posso banir um usuário com permissão maior que a minha.`;
    
        if (interaction.member.roles.highest.position < user.roles.highest.position) return interaction.reply({ content: roleUserHighestError, ephemeral: true });
        
        if (interaction.guild.me.roles.highest.position < user.roles.highest.position) return interaction.reply({ content: roleClientHighestError, ephemeral: true });
        
        user.ban({ reason: `Banido pelo: ${interaction.member.user.tag}, pelo motivo: ${motivo}` })
        
        const banSucess = new MessageEmbed()
        .setColor(config.cores.verde)
        .setDescription(`${config.emojis.certo} | Membro banido com sucesso.`)
        .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
        
        interaction.reply({ embeds: [banSucess] }).then((i) => {
          setTimeout(() => {
            if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
          }, 15000)
        })
    
        const logs = new MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setAuthor(`Autor: ${interaction.member.tag}`, interaction.member.user.avatarURL())
        .setDescription(`**Ação**: \`Ban\`\n**Membro**: \`${user.user.tag}\` - \`${user.id}\`\n**Motivo**: \`${motivo}\``)
        .setTimestamp()
        
        const channel = interaction.guild.channels.cache.get(config.canais.mod)
        if(!channel) return;
        
        channel.send({ embeds: [logs] })
      } catch (error) {
        console.log('erro Ban.js ', error)
      }
    }
}

module.exports.config = {
  name: "ban",
  description: "Comando para banir membros.",
  example: "<prefix>ban [@User] [Motivo]",
  category: "Moderação"
}