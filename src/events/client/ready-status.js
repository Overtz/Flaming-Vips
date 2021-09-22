const Event = require('../../structures/Event')

const axios = require('axios')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async () => {
      try {

        const minecraftIP = "redevicio.com"
    
        const url ="http://mcapi.us/server/status?ip="+minecraftIP
      
        // axios.get(url).then(response => {
        //   const res = response.data
      
        //   if(res.online) {
      
        //       var players = res.players.now
        //       if(!players) players = "0"

              let activities = [
                `em redevicio.com`, //`com ${players} jogadores.`
              ],
              i = 0;
              setInterval(() => this.client.user.setActivity(`${activities[i++ % activities.length]}`, {
                type: "PLAYING"
              }), 15000); //WATCHING, LISTENING, PLAYING, STREAMING
          // }
        // })
      
      } catch (error) {
        if (error.code == 500) {
        } else {
        console.log('erro ready.status.js', error)
        }
      }
    }
}