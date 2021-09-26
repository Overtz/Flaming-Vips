const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'setvip',
      description: 'Faça eu falar algo por você em embed.',
      options: [
        {
          name: 'usuário',
          type: 'USER',
          description: 'Usuário que terá seu vip.',
          required: true
        },
        {
          name: 'cargo',
          type: 'ROLE',
          description: 'Cargo do vip.',
          required: true
        },
        {
          name: 'canal',
          type: 'CHANNEL',
          description: 'Canal do vip.',
          required: true
        },
        {
          name: 'tempo',
          type: 'STRING',
          description: 'Tempo que o membro ficará com o vip.',
          required: true
        }
      ]
    })
  }

  run = async (interaction) => {

    if (!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: `${emojis.errado} | Você não tem permissão para executar este comando!`, ephemeral: true });

    const errado = this.client.emojis.cache.get('885887730901454869')
    const certo = this.client.emojis.cache.get('885887732000387132')

    const vipConfigSchema = require('../../database/models/vip-config-schema')
    const setvipSchema = require('../../database/models/setvip-schema')

    const user = interaction.options.getMember('usuário');
    const role = interaction.options.getRole('cargo');
    const tempo = interaction.options.getString('tempo');
    const channel = interaction.options.getChannel('canal');

    try {

      if (!user) return interaction.reply({ content: `${errado} | Mencione um usuário para executar este comando!`, ephemeral: true });
      if (!role) return interaction.reply({ content: `${errado} | Mencione um cargo para executar este comando!`, ephemeral: true });
      if (!tempo) return interaction.reply({ content: `${errado} | Escreva um tempo para executar este comando!`, ephemeral: true });
      if (!channel) return interaction.reply({ content: `${errado} | Mencione um canal para executar este comando!`, ephemeral: true });
      if (!channel.type == 'GUILD_VOICE') return interaction.reply({ content: `${errado} | Mencione um canal de voz para executar este comando!`, ephemeral: true });

      if (interaction.guild.me.roles.highest.position < role.position) return interaction.reply({ content: `${errado} | Minha permissão é baixa do que a deste cargo.`, ephemeral: true })

      const setvipData = await setvipSchema.findOne({ userID: user.id });
      const vipConfigData = await vipConfigSchema.findOne({ serverID: interaction.guild.id })

      if (setvipData) return interaction.reply({ content: `${errado} | Este membro já é vip.`, ephemeral: true })

      var time;
      if (tempo == 'perm') {
        time = 'perm'
      } else {
        time = ms(tempo);
      }

      if (!time) return interaction.reply({ content: `${errado} | Tempo está inválido! \n*Exemplo: /setvip [usuário] [cargo] [canal] 1d (Duração do vip será 1 dia)*`, ephemeral: true })

      var cargo = interaction.guild.roles.cache.get(role.id)

      if (!cargo) return interaction.reply({ content: `${errado} | O cargo mencionado não existe!`, ephemeral: true });

      if (user.roles.cache.has(role.id)) return interaction.reply({ content: `${errado} | O membro mencionado já tem o cargo selecionado!`, ephemeral: true });

      if (time == 'perm') {
        time = 'Permanente.'
        await setvipSchema.create({
          userID: user.id,
          setUser: interaction.member.id,
          serverID: interaction.guild.id,
          roleID: role.id,
          channelID: channel.id,
          time: time
        })
      } else {
        await setvipSchema.create({
          userID: user.id,
          setUser: interaction.member.id,
          serverID: interaction.guild.id,
          roleID: role.id,
          channelID: channel.id,
          time: Date.now() + time
        })
      }

      user.roles.add(cargo, `Vip setado por: ${interaction.member.user.tag}`)

      interaction.reply({ content: `${certo} | Vip setado com sucesso!` }).then((i) => {
        setTimeout(() => {
          if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
        }, 15000)
      })

      const emojiArray = ['🥂', '🥳', '🎉']

      const rand = Math.floor(Math.random() * emojiArray.length);

      const embedLog = new MessageEmbed()
        .setTitle('VIP LOG')
        .setColor('RANDOM')
        .setThumbnail(user.user.displayAvatarURL())
        .addField('Usuário que recebeu:', `<@${user.id}> | ${user.id}`)
        .addField('Cargo', `<@&${role.id}> | ${role.id}`)
        .addField('Canal', `<#${channel.id}> | ${channel.id}`)
        .addField('Quem setou:', `<@${interaction.member.id}> | ${interaction.member.id}`)
        .addField('Tempo:', `${time}`)

      const announce = new MessageEmbed()
        .setTitle(rand + 'Vip Anúnciamentos')
        .setColor('RANDOM')
        .setThumbnail(user.user.displayAvatarURL())
        .setDescription(`Parabéns ${user}, você recebeu um vip! Quem lhê deu: ${interaction.member}`)
        .setFooter('Duração do vip: ', time)

      if (vipConfigData.vipLogChannel == 'none') return;
      if (vipConfigData.vipAnnounceamentChannel == 'none') return;

      const log = interaction.guild.channels.cache.get(vipConfigData.vipLogChannel)
      const announceament = interaction.guild.channels.cache.get(vipConfigData.vipAnnounceamentChannel)

      if (!log) return;
      if (!announceament) return;
      await log.send({ embeds: [embedLog] })
      if (vipConfigData.vipAnnounceamentChannel == 'none') {
        return;
      } else {
        announceament.send({ embeds: [announce] })
      }

    } catch (error) {
      console.log('erro setvip.js ', error)
    }
  }
}