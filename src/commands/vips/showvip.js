const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'showvip',
      description: 'Mostra o vip de um usuário.',
      options: [
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

    const errado = this.client.emojis.cache.get('885887730901454869')
    const certo = this.client.emojis.cache.get('885887732000387132')

    const setvipSchema = require('../../database/models/setvip-schema')

    const user = interaction.options.getMember('usuário');
    const ms = require('ms')

    try {
      if (!user) return interaction.reply({ content: `${errado} | Mencione um usuário para executar este comando!`, ephemeral: true })

      const setvipData = await setvipSchema.findOne({ userID: user.id })
      if(!setvipData) return interaction.reply({ content: `${errado} | Este usuário não é vip!`, ephemeral: true })
      
      const role = interaction.guild.roles.cache.get(setvipData.roleID)
      if (!role) return interaction.reply({ content: `${errado} | O Cargo vinculado ao vip, é inválido.`, ephemeral: true })

      const time = setvipData.time
      if (!time) return interaction.reply({ content: `${errado} | Algo deu errado.`, ephemeral: true })
      var tempo;

      if (time == 'Permanente.') {
        tempo = 'Permanente'
      } else {
        tempo = ms(Math.floor(time - Date.now()), { long: true })
      }

      console.log(tempo)
      console.log(time)

      const embed = new MessageEmbed()
      .setAuthor(`Vip de ${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
      .setColor(role.displayHexColor)
      .addField(`Cargo vinculado`, `<@&${role.id}> | ${role.id}`)
      .addField(`Duração`, `${tempo}`)
      .addField(`Quem setou`, `<@${setvipData.setUser}> | ${setvipData.setUser}`)

      interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.log('Erro em showvip', err)
    }
    
  }
}