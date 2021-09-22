const Event = require('../../structures/Event')

const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async () => {

      const config = require('../../../config.json')
      const muteTimeSchema = require('../../database/models/mute-time-schema')

      const index = require('../../../index')
      const client = index.client

      setInterval(async () => {
    
        try {
    
            let guild = client.guilds.cache.get(config.servidores.servidor)

            const muteTimeData = await muteTimeSchema.findOne({ serverID: guild.id })

            if (!muteTimeData) return;
    
            var member = await client.users.fetch(muteTimeData.userID).catch(e => {
              
              if(e) return;
              
            })
            
            var time = await muteTimeData.time
            if (time == 'Permanente.') return;
            var channel = guild.channels.cache.get(config.canais.mod)
            var role = guild.roles.cache.find(r => r.name === "Mutado")

            const remover = time.replace("m", "")

            var filterFloat = function (value) {
              if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
                .test(value))
                return Number(value);
            return NaN;
          }

            const tempo = filterFloat(remover)
            
            if(Date.now() > tempo) {
              
              var moment = require("moment")
              moment.locale("pt-BR")
              
              if(guild.members.resolve(member)) {

                const resolveMember =  guild.members.resolve(member)
              
                resolveMember.roles.remove(role, `Unmute`)
                
              }
              
              await muteTimeSchema.findOneAndDelete({ userID: member.id })
              
              var logs = new MessageEmbed()
              .setColor(guild.me.displayHexColor)
              .setAuthor(`Autor: ${guild.me.user.tag}`, guild.me.user.displayAvatarURL())
              .setDescription(`**Ação**: \`Unmute\`\n**Membro**: ${member} - \`${member.id}\``)
              .setTimestamp()
              
              if(!channel) return;
        
              channel.send({ embeds: [logs] })
              
            }else {
              
              if(guild.members.resolve(member)) {
                
                if(guild.members.resolve(member).roles.cache.has(role.id)) return;
                
                guild.members.resolve(member).roles.add(role.id)
                
              }
          }
        } catch (error) {
          if (error.code == 500) {
          } else {
          console.log('erro ready.Mute.js', error)
          }
        }
        
      }, 2000)
    }
}