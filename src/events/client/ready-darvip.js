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
      const setvipTimeSchema = require('../../database/models/setvip-time-schema')

      const index = require('../../../index')
      const client = index.client

      setInterval(async () => {
    
        try {
        
            
            let guild = client.guilds.cache.get(config.servidores.servidor)

            const setvipTimeData = await setvipTimeSchema.findOne({ serverID: guild.id })

            if (!setvipTimeData) return;
    
            var member = await client.users.fetch(setvipTimeData.userID).catch(e => {
              
              if(e) return;
              
            })
            
            var time = await setvipTimeData.time
            if (time == 'Permanente.') return;
            var channel = guild.channels.cache.get(config.canais.mod)
            var role = guild.roles.cache.find(r => r.name === "💲│VIP")

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
              
                resolveMember.roles.remove(role, `Remoção de VIP`)
                
              }
              
              await setvipTimeSchema.findOneAndDelete({ userID: member.id })
              
              var logs = new MessageEmbed()
              .setColor(guild.me.displayHexColor)
              .setAuthor(`Autor: ${guild.me.user.tag}`, guild.me.user.displayAvatarURL())
              .setDescription(`**Ação**: \`Remoção de VIP\`\n**Membro**: ${member} - \`${member.id}\``)
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
          console.log('erro ready.darvip.js', error)
          }
        }
        
      }, 2000)
    }
}