const Event = require('../../structures/Event')

const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: 'ready'
    })
  }

  run = async () => {

    const setvipSchema = require('../../database/models/setvip-schema')
    const setvipConfigSchema = require('../../database/models/vip-config-schema')

    const client = this.client

    setInterval(async () => {

      try {


        const guild = client.guilds.cache.get('836291214847901796') //791491164729638913

        if (!guild) return;
        const setvipData = await setvipSchema.findOne({ serverID: guild.id })
        const setvipConfigData = await setvipConfigSchema.findOne({ serverID: guild.id })

        if (!setvipData) return;

        var member = await client.users.fetch(setvipData.userID).catch(e => {
          if (e) return;
        })

        var time = await setvipData.time
        if (time == 'Permanente.') return;
        var role = guild.roles.cache.get(setvipData.roleID)
        if (!role) {
          await setvipSchema.findOneAndDelete({ userID: member.id })
          return console.log("Cargo do vip não encontrado, liberando espaço...")
        }

        const remover = time.replace("m", "")

        var filterFloat = function (value) {
          if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
            .test(value))
            return Number(value);
          return NaN;
        }

        const tempo = filterFloat(remover)

        if (Date.now() > tempo) {

          var moment = require("moment")
          moment.locale("pt-BR")

          if (guild.members.resolve(member)) {

            const resolveMember = guild.members.resolve(member)

            resolveMember.roles.remove(role, `Remoção de VIP`)
            // resolveMember.roles.remove('791491164746285072')
          }

          await setvipSchema.findOneAndDelete({ userID: member.id })

          if (!setvipConfigData) return console.log("Canal de log não encontrado.");
          var channel = guild.channels.cache.get(setvipConfigData.vipLogChannel);

          var logs = new MessageEmbed()

            .setTitle('VIP LOG - Remoção de Vip')
            .setColor('RANDOM')
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .addField('Usuário que recebeu:', `<@${member.id}> | ${member.id}`)
            .addField('Cargo Vip:', `<@&${role.id}> | ${role.id} `)
            .addField('Motivo:', 'Expiração.')
            .addField('Quem havia setado:', `<@${setvipData.setUser}> | ${setvipData.setUser}`)

          if (!channel) return;

          channel.send({ embeds: [logs] })

        } else {

          if (guild.members.resolve(member)) {

            if (guild.members.resolve(member).roles.cache.has(role.id)) return;

            guild.members.resolve(member).roles.add(role.id)
            // guild.members.resolve(member).roles.add('791491164746285072')

          }
        }
      } catch (error) {
        if (error.code == 500) {
        } else {
          console.log('erro ready.darvip.js', error)
        }
      }

    }, 2000)
  }
}