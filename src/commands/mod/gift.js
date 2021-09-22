const Command = require('../../structures/Command')

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'gift',
            description: 'Envie presentes com este comando.',
            options: [
              {
                name: 'canal',
                type: 'CHANNEL',
                description: 'Escolha que será enviado o presente.',
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
      .setDescription(`${config.emojis.errado} | ${interaction.member}, você não tem permissão para executar esse comando.`)
      .setFooter(`Permissão: Administrador.`)


    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ embeds: [erro], ephemeral: true });
      
    const canal = interaction.options.getChannel('canal')

    if(!canal) {
      
      var erro = new MessageEmbed()
      .setColor(config.cores.vermelho)
      .setDescription(`${config.emojis.errado} | ${interaction.member}, não achei esse canal.`)
      
      interaction.reply({ embeds: [erro], ephemeral: true })
      
    }
    
    var gifts = ["Cash", "1 VIP", "Spawner"]
    var gift = gifts[Math.floor(Math.random() * gifts.length)]
    
    var presenteSucess = new MessageEmbed()
    .setColor(config.cores.verde)
    .setDescription(`${config.emojis.certo} | Presente enviado com sucesso.`)
    .setFooter(`Autor: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
    
    interaction.reply({ embeds: [presenteSucess] })

    const giftButton = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('giftButton')
              .setEmoji('🎁')
              .setStyle('PRIMARY'),
          );
    
    var a = new MessageEmbed()
    .setColor(interaction.guild.me.displayHexColor)
    .setDescription(`**Mas o que é isso, aqui rapaziada??**\n\`Sim, é um presente para o primeiro que reagir com o emoji abaixo!\`\n\n**Qual o presente?** \`${gift}\`\n\n**CORRAM!**`)
    .setFooter(`Reaja abaixo para pega-lo!`)

    var msg = await canal.send({ embeds: [a], components: [giftButton] })

    const filter = i => i.customId === 'giftButton';
  
    const collector = canal.createMessageComponentCollector({ filter, max: 1 });
    
    collector.on("collect", async i => {
      if (i.customId === 'giftButton') {

        msg.delete()
        await msg.channel.send({ content: `Um ser chamado: <@${i.user.id}>, reajiu e conseguiu resgatar o presente!` })
      
      var userWinned = await interaction.guild.members.resolve(i.user.id)
      
      if(interaction.guild.me.permissions.has("MANAGE_CHANNELS")) {
        
        var channel = await interaction.guild.channels.create(`Presente do ${userWinned.user.username}`, "text")
        await channel.setParent(config.categorias.ticket)
        
        var role = interaction.guild.roles.cache.find(r => r.name == "@everyone")
        
        await channel.permissionOverwrites.edit(role.id, {
      
          VIEW_CHANNEL: false
          
        })
          
        await channel.permissionOverwrites.edit(userWinned.id, {
      
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
            
        })

        const message1 = new MessageEmbed()
        .setColor(config.cores.verde)
        .setDescription(`${config.emojis.certo} | Boa ${userWinned}, você conseguiu ganhar **${gift}**, como presente!\n\nVá até o canal ${channel} e converse com um Administrador!`)
        
        msg.edit({ embeds: [message1], components: [] })
        
        const message2 = new MessageEmbed()
        .setColor(config.cores.verde)
        .setDescription(`${config.emojis.certo} | Boa ${userWinned}, você conseguiu ganhar **${gift}**, como presente!\n\nConverse com um Administrador por meio desse canal!`)
        
        channel.send({ content: `<@${userWinned.id}>`, embeds: [message2], components: [] })
        
      } else {
        
        const message3 = new MessageEmbed()
        .setColor(config.cores.verde)
        .setDescription(`${config.emojis.certo} | Boa ${userWinned}, você conseguiu ganhar **${gift}**, como presente!\n\nVá até o privado de um Administrador e converse com ele!`)
        
        msg.edit({ embeds: [message3], components: [] })
        
      }
    }
      
    })

    
  } catch (error) {
    console.log('erro Gift.js', error)
  }
}
  
}

exports.config = {

  name: "gift",
  description: "Comando para dar um presente para os membros.",
  example: "<prefix>gift [#Canal]",
  category: "Moderação"
  
}