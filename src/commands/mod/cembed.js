const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'cembed',
            description: 'Comando para criar a sua embed.'
        })
    }
    
    run = async (interaction) => {

      const config = require('../../../config.json')

  try {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) {

      var erro = new MessageEmbed()
      .setColor(config.cores.vermelho)
      .setDescription(`${config.emojis.errado} | ${interaction.member}, você não tem permissão para executar esse comando.`)
      .setFooter(`Permissão: Administrador.`)
      
      return interaction.reply({ embeds: [erro], ephemeral: true });
      
    }
  
    var a = new MessageEmbed()
    .setColor(config.cores.verde)
    .setDescription(`${config.emojis.certo} | ${interaction.member}, verifique seu privado.`)
  
    var pmsg = await interaction.reply({ embeds: [a], ephemeral: true })
    

    var embed = new MessageEmbed()
    
    const b = new MessageEmbed()
    .setColor(interaction.guild.me.displayHexColor)
    .setDescription(`Para começarmos, insira a cor de sua embed (Em formato HTML) ou insira \`Nenhuma\` para nenhuma cor.`)
    .setFooter(`A embed abaixo é sua embed!`)
  
    var msg = await interaction.member.send({ embeds: [b], ephemeral: true })
  
    

    var dmMessage;

        const dm = await interaction.member.createDM().then((channel) => {
          dmMessage = channel;
        })

    const filter = m => m.author.id == interaction.member.id;
  
    var c = await dmMessage.createMessageCollector({ filter, max: 1})
    c.on("collect", async m => {
  
      if(!["nenhuma"].includes(m.content.toLowerCase())) {
        
        if(m.content.split("")[0] !== "#") {
  
          const erro1 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, cores em HTML normalmente começam com **#**.`)
  
          return m.channel.send({ embeds: [erro1], ephemeral: true })
  
        }
  
        if(m.content.length < 7) {
  
          const erro2 = new MessageEmbed()
          .setColor(config.cores.vermelho)
          .setDescription(`${config.emojis.errado} | ${interaction.member}, cores em HTML normalmente contem 7 caracteres.`)
  
          return m.channel.send({ embeds: [erro2], ephemeral: true })
  
        }
        
        embed.setColor(m.content)
        
      }
  
      const c = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .setDescription(`Agora insira o título da embed ou insira \`Nenhum\` para nenhum título.`)
      .setFooter(`A embed abaixo é sua embed!`)
  
      msg = m.channel.send({ embeds: [c], ephemeral: true })
      var msgembed;
  
      var c2 = await dmMessage.createMessageCollector({ filter, max: 1})
      c2.on("collect", async m2 => {
  
        if(!["nenhum"].includes(m2.content.toLowerCase())) {
  
          if(m2.content.length > 256) {
  
            var erro = new MessageEmbed()
            .setColor(config.cores.vermelho)
            .setDescription(`${config.emojis.errado} | ${interaction.member}, titulos de embed só podem ter 256 carecteres.`)
  
            return m2.channel.send({ embeds: [erro] })
  
          }
  
          embed.setTitle(m2.content)
  
        }
  
        var a = new MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(`Agora a thumbnail da embed ou insira \`Nenhuma\` para nenhuma thumb.`)
        .setFooter(`A embed abaixo é sua embed!`)
  
        msg = await interaction.member.send({ embeds: [a] })
        msgembed = await interaction.member.send({ embeds: [embed] })
  
        var c3 = await dmMessage.createMessageCollector({ filter, max: 1})
        c3.on("collect", async m3 => {
  
          if(!["nenhuma"].includes(m3.content.toLowerCase())) {
          
            const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

            if (regex.exec(m3.content)) return m3.channel.send({ content: 'URL\'s geralmente contém "https" no início.'})

            try {
              embed.setThumbnail(m3.content)
            } catch (e) {
              m.channel.send({ content: 'URL inválido, tente o comando novamente.' })
            }

          }
  
          var a = new MessageEmbed()
          .setColor(interaction.guild.me.displayHexColor)
          .setDescription(`Agora a descrição da embed ou insira \`Nenhuma\` para nenhuma descrição.`)
          .setFooter(`A embed abaixo é sua embed!`)
  
          msg = await interaction.member.send({ embeds: [a] })
          msgembed = await interaction.member.send({ embeds: [embed] })
  
          var c4 = await dmMessage.createMessageCollector({ filter, max: 1})
          c4.on("collect", async m4 => {
  
            if(!["nenhuma"].includes(m4.content.toLowerCase())) {
  
              if(m4.content.length > 2048) {
  
                var erro = new MessageEmbed()
                .setColor(config.cores.vermelho)
                .setDescription(`${config.emojis.errado} | ${interaction.member}, descrições de embed só podem ter 2048 carecteres.`)
      
                return interaction.member.send({ embeds: [erro] })
      
              }
    
              embed.setDescription(m4.content)
      
            }
  
            var a = new MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            .setDescription(`Agora a imagem da embed ou insira \`Nenhuma\` para nenhuma imagem.`)
            .setFooter(`A embed abaixo é sua embed!`)
  
            msg = await interaction.member.send({ embeds: [a] })
            msgembed = await interaction.member.send({ embeds: [embed] })
  
            var c5 = await dmMessage.createMessageCollector({ filter, max: 1 })
            c5.on("collect", async m5 => {
  
              if(!["nenhuma"].includes(m5.content.toLowerCase())) {

                const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
                
                if (regex.exec(m3.content)) return m5.channel.send({ content: 'URL\'s geralmente contém "https" no início.'});
  
                embed.setImage(m5.content)
  
              }
  
              var a = new MessageEmbed()
              .setColor(interaction.guild.me.displayHexColor)
              .setDescription(`Agora o rodapé da embed ou insira \`Nenhum\` para nenhum rodapé.`)
              .setFooter(`A embed abaixo é sua embed!`)
  
              msg = await interaction.member.send({ embeds: [a] })
              msgembed = await interaction.member.send({ embeds: [embed] })
  
              var c6 = await dmMessage.createMessageCollector({ filter, max: 1})
              c6.on("collect", async m6 => {
  
                if(!["nenhum"].includes(m6.content.toLowerCase())) {
  
                  if(m6.content.length > 2048) {
  
                    var erro = new MessageEmbed()
                    .setColor(config.cores.vermelho)
                    .setDescription(`${config.emojis.errado} | ${interaction.member}, rodapé's de embed só podem ter 2048 carecteres.`)
          
                    return interaction.member.send({ embeds: [erro] })
          
                  }
      
                  embed.setFooter(m6.content)
          
                }
  
                var a = new MessageEmbed()
                .setColor(interaction.guild.me.displayHexColor)
                .setDescription(`Agora insira o id do canal onde a embed será enviada ou escreva \`cancelar\` para cancelar o comando.`)
                .setFooter(`A embed abaixo é sua embed!`)
  
                msg = await interaction.member.send({ embeds: [a] })
                msgembed = await interaction.member.send({ embeds: [embed] })
  
                var c7 = await dmMessage.createMessageCollector({ filter, max: 1})
                c7.on("collect", async m7 => {
  
                  if(["cancelar"].includes(m7.content.toLowerCase())) {
  
                    var erro = new MessageEmbed()
                    .setColor(config.cores.vermelho)
                    .setDescription(`${config.emojis.errado} | ${interaction.member}, comando cancelado.`)
            
                    return interaction.member.send({ embeds: [erro] })
            
                  }
  
                  if(!interaction.guild.channels.cache.get(m7.content)) {
  
                    var erro = new MessageEmbed()
                    .setColor(config.cores.vermelho)
                    .setDescription(`${config.emojis.errado} | ${message.author}, não achei esse canal.`)
            
                    return interaction.member.send({ embeds: [erro] })
  
                  }
  
                  try {
  
                    interaction.guild.channels.cache.get(m7.content).send({ embeds: [embed] }).then(() => {
  
                      var a = new MessageEmbed()
                      .setColor(interaction.guild.me.displayHexColor)
                      .setDescription(`Embed enviada com sucesso ao canal <#${m7.content}>.`)
  
                      interaction.member.send({ embeds: [a] })
  
                    })
  
                  }catch(e) {
  
                    var erro = new MessageEmbed()
                    .setColor(config.cores.vermelho)
                    .setDescription(`${config.emojis.errado} | ${interaction.member}, algo deu errado.`)
            
                    return interaction.member.send({ embeds: [erro] })
  
                  }
  
                })
  
              })
  
            })
  
          })
  
        })
  
      })
  
    })
  } catch (e) {
    if (e.code == 50007) {
      return interaction.reply({ content: '❌ | Erro ao enviar uma mensagem em sua DM.\nPossível motivo: DM fechada.', ephemeral: true });
    } else {
      interaction.reply({ embeds: [erro] })
      return console.log('Erro: ', e)
    }
  }

}
}

exports.config = {
  name: "criarembed",
  description: "Comando para criar a sua embed.",
  example: "<prefix>criarembed",
  category: "Moderação"
}