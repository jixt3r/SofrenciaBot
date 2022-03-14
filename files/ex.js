require('dotenv/config');
const https = require('https');
const options = {
  hostname: 'discord.com',
  port: 443,
  path: '/oauth2/@me?client_id=946574773100638219&scope=identify&response_type=code',
  method: 'GET',
};

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.login(process.env.TOKEN);

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    console.log(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
