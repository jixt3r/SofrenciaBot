const express = require('express');
const config = require('./config.json');
const { Client, Intents } = require('discord.js');
require('dotenv/config');
const app = express();
const ForcaBot = process.env.FORCABOT;
const BotTestes = process.env.TESTESBOT;
var usero;
var all = {
  client: new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
  }),
  ativos: {}
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

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours (ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});

app.listen(8180) // Recebe solicitações que o deixa online

client.on('ready', (client) => {
  console.log('\n- Bot pronto. Manda bala!');
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!(message.content.startsWith(config.prefix.toLowerCase()) || message.content.startsWith(config.prefix.toUpperCase()))) return;
    all.message = message;
    all.args = message.content.split(' ');
    if (all.ativos[message.channelId] == undefined) {
      all.ativo = false;
    } else {
      all.ativo = true;
    }
    //console.log(all.ativos[message.channelId]);
    if (all.ativo == false) {
    //Se nao estiver ativo
      let command = all.args[0].slice(config.prefix.length).toLowerCase();
      try {
        let commandFile = require('./commands/' + command + '.js');
        return commandFile.run(all);
      } catch (err) {
          console.log('\n- Erro1: ' + err);
          //throw err;
      }
    } else {
    //Se estiver ativo
        try {
          let command = all.ativos[message.channelId].servico;
          let commandFile = require('./commands/' + command + '.js');
          return commandFile.run(all);
        } catch (err) {
            console.error('\n- Erro2:' + err);
        }
    }
});

//promise.then(console.log, console.error);

client.login(BotTestes); //Ligando o Bot caso ele consiga acessar o token
