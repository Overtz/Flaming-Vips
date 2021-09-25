const Command = require('../../structures/Command')

const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'remvip',
            description: 'Faça eu falar algo por você em embed.',
            options: [
              {
                name: 'usuário',
                type: 'USER',
                description: 'Usuário que terá seu vip.',
                required: true
              },
              {
                  name: 'motivo',
                  type: 'STRING',
                  description: 'Motivo da remoção.',
                  required: true
              }
            ]
        })
    }
    
    run = async (interaction) => {

        if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: `${emojis.errado} | Você não tem permissão para executar este comando!`, ephemeral: true });

        const errado = this.client.emojis.cache.get('885887730901454869')
        const certo = this.client.emojis.cache.get('885887732000387132')
  
        const vipConfigSchema = require('../../database/models/vip-config-schema')
        const setvipSchema = require('../../database/models/setvip-schema')
        
        const user = interaction.options.getMember('usuário');
        const motivo = interaction.options.getString('motivo');

        try {
            if (!user) return interaction.reply({ content: `${errado} | Mencione um usuário para executar este comando!`, ephemeral: true });
            if (!motivo) return interaction.reply({ content: `${errado} | Adicione um motivo para executar este comando!`, ephemeral: true })

            var reason = motivo;
            if (!motivo) {
                reason = 'Nenhum.'
            }

            const setvipData = await setvipSchema.findOne({ userID: user.id });
            const vipConfigData = await vipConfigSchema.findOne({ serverID: interaction.guild.id })

            const role = interaction.guild.roles.cache.get(setvipData.roleID);
            if (!role) return interaction.reply({ content: `${errado} | Cargo do vip não foi encontrado.`, ephemeral: true });

            if (interaction.guild.me.roles.highest.position < role.position) return interaction.reply({ content: `${errado} | Minha permissão é baixa do que a deste cargo.`, ephemeral: true })

            if (user.roles.cache.has(role.id)) {
                await user.roles.remove(role.id)
                await setvipSchema.findOneAndDelete({ userID: user.id })
                
                interaction.reply({ content: `${certo} | Vip removido com sucesso!` }).then((i) => {
                    setTimeout(() => {
                      if (interaction.deleteReply()) return console.log('Mensagem programada deletada com sucesso!');
                    }, 15000)
                  })

                  const embedLog = new MessageEmbed()
                  .setTitle('VIP LOG')
                  .setColor('RANDOM')
                  .setThumbnail(user.user.displayAvatarURL())
                  .addField('Usuário que recebeu:', `${user}`)
                  .addField('Quem setou:', `<@${interaction.member.id}> | ${interaction.member.id}`)
                  .addField('Motivo da Remoção:', `${reason}`)

                  if (vipConfigData.vipLogChannel == 'none') return;

                  const log = interaction.guild.channels.cache.get(vipConfigData.vipLogChannel)

                  if (!log) return;
                  await log.send({ embeds: [embedLog] }) 
            }
        } catch(error) {
            console.log(error)
        }
    }
}