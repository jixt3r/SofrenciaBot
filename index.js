const express = require('express');
const config = require('./config.json');
const { inMili } = require('./files/funcs.js');
const { Client, Intents } = require('discord.js');
require('dotenv/config');
const app = express();
const ForcaBot = process.env.FORCABOT;
const BotTestes = process.env.TESTESBOT;
const Bot = [BotTestes, ForcaBot];
var usero;
var all = {
  client: new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES]
  }),
  ativos: {},
  dm: null
};
const client = all.client;

// Intents: "GUILDS" "GUILD_MEMBERS" "GUILD_BANS"
//"GUILD_EMOJIS_AND_STICKERS" "GUILD_INTEGRATIONS"
//"GUILD_WEBHOOKS" "GUILD_INVITES"
//"GUILD_VOICE_STATES" "GUILD_PRESENCES"
//"GUILD_MESSAGES" "GUILD_MESSAGE_REACTIONS"
//"GUILD_MESSAGE_TYPING" "DIRECT_MESSAGES"
//"DIRECT_MESSAGE_REACTIONS"
//"DIRECT_MESSAGE_TYPING" "GUILD_SCHEDULED_EVENTS"

const filter = (m) => {
      return m.author == '393094770794299392' && m.content.toLowerCase().startsWith('send');
};

all.hear = async (a) => { //cria escutador
     //console.log('arroz');
     let dm = all.dm;
     let dmCollector = dm.createMessageCollector({ filter, time: inMili('36:00:00') });
     dmCollector.on("collect", message => {
       let text = message.content.split('=');
       let channel = all.channelToSend;
       channel.send(text[1]);
     });
     dmCollector.on("end", collected => {
       all.hear();
     });
};

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours (ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});

app.listen(8080) // Recebe solicitações que o deixa online

client.on('ready', (client) => {
  console.log('\n- Bot pronto. Manda bala!');
});

client.on('messageCreate', async (message) => {
   //console.log(chan.lastMessage);
   //if (message.author.bot) console.log(message.embeds[0].fields[0]);
   if (message.author.bot) return;
   var channel = message.channel;
   if (message.content.startsWith('.')) {
     try {
       let commandFile = require('./commands/soccer.js');
       return commandFile.run(message);
     } catch (err) {
       channel.send('Quebrou o bot');
       throw err;
       console.log("-- Erro no soccer!");
     }
   };
    if (!(message.content.startsWith(config.prefix.toLowerCase()) || message.content.startsWith(config.prefix.toUpperCase()))) return;

    all.message = message;
    all.args = message.content.split(' ');

    if (all.ativos[message.channelId] == undefined) {
      all.ativo = false;
    } else {
      all.ativo = true;
    }

    if (all.ativo == false) {
    //Se nao estiver ativo
      let command = all.args[0].slice(config.prefix.length).toLowerCase();
      try {
        let commandFile = require('./commands/' + command + '.js');
        return commandFile.run(all);
      } catch (err) {
          channel.send('Quebrou o bot');
          console.log('\n- Erro1: ' + err);
          //throw err;
      }
    } else {
    //Se estiver ativo
        try {
          let command = all.args[0].slice(config.prefix.length).toLowerCase();
          //let command = all.ativos[message.channelId].servico;
          let commandFile = require('./commands/' + command + '.js');
          return commandFile.run(all);
        } catch (err) {
            let command = all.ativos[message.channelId].servico;
            let commandFile = require('./commands/' + command + '.js');
            return commandFile.run(all);
            //console.error('\n- Erro2:' + err);
        }
    }
});

client.login(Bot[0]); //Ligando o Bot caso ele consiga acessar o token
