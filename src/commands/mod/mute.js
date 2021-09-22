const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')
const ms = require("ms")

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Silencie membros com este comando.',
            options: [
              {
                name: 'usuário',
                type: 'USER',
                description: 'Usuário que será silenciado.',
                required: true
              },
              {
                name: 'tempo',
                type: 'STRING',
                description: 'Tempo que o usuário será silenciado.',
                required: true
              },
              {
                name: 'motivo',
                type: 'STRING',
                description: 'Motivo que o usuário será silenciado.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {
      const config = require('../../../config.json');
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
    
    const user = interaction.options.getMember('usuário');
    const motivo = interaction.options.getString('motivo') || "Nenhum motivo informado.";
    const muteTimeData = await muteTimeSchema.findOne({ userID: user.id })

    const roleUserHighestError = `${config.emojis.errado} | Você não pode silenciar um usuário com permissão maior que a sua.`;
    const roleClientHighestError = `${config.emojis.errado} | Não posso silenciar um usuário com permissão maior que a minha.`;

    if (interaction.member.roles.highest.position < user.roles.highest.position) return interaction.reply({ content: roleUserHighestError, ephemeral: true });
    
    if (interaction.guild.me.roles.highest.position < user.roles.highest.position) return interaction.reply({ content: roleClientHighestError, ephemeral: true });

    const erro3 = new MessageEmbed()
      .setColor(config.cores.vermelho)
      .setDescription(`${config.emojis.errado} | ${interaction.member}, esse membro já está mutado.`)
    if(muteTimeData) return interaction.reply({ embeds: [erro3], ephemeral: true });

    const tempo = interaction.options.getString('tempo');
    
    var tempoMS = ms(tempo)
    const erro4 = new MessageEmbed()
      .setColor(config.cores.vermelho)
      .setDescription(`${config.emojis.errado} | ${interaction.member}, você errou o formato do tempo.`)
      .setFooter(`Formato: 1s, 1m, 1h ou 1d`)
    

    if(!tempoMS) return interaction.reply({ embeds: [erro4], ephemeral: true });
    
    var cargo = interaction.guild.roles.cache.find(r => r.name === "Mutado")
    
    module.exports.tempoMS = tempoMS

    if(!cargo) {
      cargo = await interaction.guild.roles.create({name: "Mutado", color: "#2f3136", permissions: []})

      const embedRoleCreated = new MessageEmbed()
      .setDescription(`${config.emojis.certo} | ${interaction.member}, criei o cargo para silenciar, use o comonado novamente.`)

      return interaction.reply({ embeds: [embedRoleCreated], ephemeral: true })
    }
    
    const muteTimeSetOnDB = await muteTimeSchema.create({
      userID: user.id,
      serverID: interaction.guild.id,
      time: Date.now() + tempoMS
    })
    
    user.roles.add(cargo.id, `Mutado pelo: ${interaction.member.user.tag}, tempo: ${tempo}, motivo: ${motivo}`)
    
    var a = new MessageEmbed()
    .setColor(config.cores.verde)
    .setDescription(`${config.emojis.certo} | Membro mutado com sucesso.`)
    .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
    
    interaction.reply({ embeds: [a] }).then((i) => {
      setTimeout(() => {
        if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
      }, 15000)
    })
    
    var logs = new MessageEmbed()
    .setColor(clientColor)
    .setAuthor(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
    .setThumbnail(user.user.avatarURL())
    .setDescription(`**Ação**: \`Mute\`\n**Membro**: \`${user.user.tag}\` - \`${user.user.id}\`\n**Motivo**: \`${motivo}\`\n**Tempo**: \`${tempo}\``)
    .setTimestamp()
    
    var channel = interaction.guild.channels.cache.get(config.canais.mod)
    if(!channel) return;
    
    channel.send({ embeds: [logs] })
  } catch (error) {
    console.log('erro Mute.js ', error)
  }
    }
}

module.exports.config = {
  name: "mute",
  description: "Comando para silenciar membros.",
  example: "<prefix>mute [@User] [Tempo] [Motivo]",
  category: "Moderação"
}
