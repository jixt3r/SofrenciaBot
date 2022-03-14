const express = require('express');
const config = require('./config.json'); //Pegand>
const { Client, Intents } = require('discord.js');
require('dotenv/config');
const app = express();
var all = {
  client: new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]}),
  ativos: {
    //<channelId>: {
    //  servico: <command>,
    //  infos:
    //}
  }
};
const client = all.client;

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours (ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});

app.listen(8080); // Recebe solicitações que o deixa online

client.on('ready', () => {
	console.log('- Bot pronto. Manda bala!');
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
          throw err;
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

all.client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token
