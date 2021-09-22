const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'changelog',
            description: 'Faça alguma mudança em seu servidor.',
            options: [
              {
                name: 'conteúdo',
                type: 'STRING',
                description: 'Conteúdo da alteração.',
                required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {
      const config = require('../../../config.json')
      const clientColor = interaction.guild.me.displayHexColor

  var erro = new MessageEmbed()
    .setColor(config.cores.vermelho)
    .setDescription(`${config.emojis.errado} | ${interaction.member}, para executar esse comando é necessario permissão.`)
    .setFooter(`Permissão: Gerenciar cargos`)

  if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({ embeds: [erro], ephemeral: true });
  
  const staff = interaction.options.getString('conteúdo')

  erro = new MessageEmbed()
    .setColor(config.cores.vermelho)
    .setDescription(`${config.emojis.errado} | ${interaction.member}, não esqueça de atribuir algum valor.`)
  
  if(!staff) return interaction.reply({ embeds: [erro], ephemeral: true });

  const embed = new MessageEmbed()
  .setColor(clientColor)
  .addField(`👮 RedeVicio • Changelog`, `▫ ${staff}`)
  .addField("Atenciosamente,", "__Equipe Rede Vicio__")
  .setFooter(`${interaction.guild.me.user.username} ©`, this.client.user.avatarURL())
  .setTimestamp()
  
  interaction.channel.send({ embeds: [embed] })
  interaction.reply({ content: 'Mensagem enviada com sucesso!', ephemeral: true })
    }
}

module.exports.config = {

  name: "stafflog",
  description: "Faça alguma mudança em seu servidor.",
  example: "<prefix>stafflog [Conteudo]",
  category: "Moderação"
  
}