const express = require('express');
const config = require('./config.json'); //Pegand>
require('dotenv/config');
const app = express();

app.get("/", (request, response) => {
const ping = new Date();
ping.setHours (ping.getHours() - 3);
console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
response.sendStatus(200);
});

app.listen(8080); // Recebe solicitações que o deixa online

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.on('ready', () => {
	console.log('Bot pronto!');
});

client.on('messageCreate', (message) => {
        if (message.content.startsWith(config.prefix.toLowerCase()) || message.content.startsWith(config.prefix.toUpperCase())) {
           let args = message.content.split(' ');
           let command = args[0].slice(config.prefix.length);
           try {
              let commandFile = require('./commands/' + command + '.js');
              return commandFile.run(message, args, client);
           } catch (err) {
              console.error("erro:" + err);
           }
           //console.log(command);
        }
});

client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token
