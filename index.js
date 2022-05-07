
//------------------ Variáveis ---------------------\\

require('dotenv/config');
const { inMili } = require('./files/funcs.js');
const { Client, Intents, MessageActionRow } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const fs = require('fs');
const { prefix } = require('./config.json');
cwd = process.cwd();
const lashs = [ 'send', 'ajuda' ];
let slashs = {};
for (slash of lashs) {
  slashs[slash] = require(`${cwd}/slashs/${slash}.js`);
};
const commands = [ '#', 'ajuda', 'discoin', 'embed',
'forca', 'r1', 'reply', 'send' ];
let comms = {};
for (command of commands) {
  comms[command] = require(`${cwd}/commands/${command}.js`);
};
const express = require('express');
const app = express();
const SofreBot = process.env.SOFREBOT;
const BotTestes = process.env.TESTESBOT;
const Bots = [BotTestes, SofreBot];
const snow = new RegExp('[0-9]{17}');
var all = {
  client: new Client({
    presence: {
      activities: [
        { name: 'A galera do SOFRENCIA y SOLIDÃO', type: 'WATCHING', }
      ]
    },
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES]
  })
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

//------------------- Funções ----------------------\\

print = (text) => {
  console.log(text);
};

var tem = () => {
  client.application.commands.fetch()
   .then(col => {
    console.log(`- Comandos no bot: ${col.size}`);
    col.each(comm => print(` • ${comm.name}`))
   });
};

var oGuilds;

upGuilds = async () => {
  oGuilds = await client.guilds.fetch()
   .then(col => col.values());
};

filExists = async (file) => {
  fs.readFile(file, 'utf-8', async (err, data) => {
    if (!err) return;
    await fs.writeFile(file, '{}', (err) => {})
  });
};

//------------------- Código -----------------------\\

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours (ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(8080) // Recebe solicitações que o deixa online


client.on('ready', async (client) => {
  console.log('\n- Bot pronto. Manda bala!\n');
  tem();
  await upGuilds();
  for (oGuild of oGuilds) {
    //await filExists(`./db/guilds/${oGuild.id}.nosql`);
    comms['discoin'].init(await oGuild.fetch());
  };
});


client.on('interactionCreate', async i => {
  let msg = i.message;
  let chan = i.channel;

  if (i.isCommand()) {
    let name = i.commandName;
    if (!lashs.includes(name)) return;
    return slashs[name].run(i);
  };

  if (i.isSelectMenu()) {
    return comms['ajuda'].responsive(i, msg, chan);
  };

  if (i.channel.parent.name == 'Discoin') {
    return comms['discoin'].responsive(i, msg, chan)
  };

});


client.on('messageCreate', async (message) => {
  //if (message.author.bot) return;
  //let ref = await message.channel.messages.fetch(message.reference.messageId);
  //console.log(ref.embeds[0]);
  //let commandFile = require(`./i.js`);
  //return commandFile.run(message);
  let chan = message.channel;
  if (snow.test(chan.topic)) {
    try {
      return comms['discoin'].responsive(null, message, chan);
    } catch (err) {
      return console.warn(`\n- Erro7: ${err}`);
      //throw err;
    };
  };
  if (message.author.bot) return;
  let content = message.content.toLowerCase();
  if (!content.startsWith(prefix)) return;
  let args = content.slice(prefix.length).trim().split(' ');
  let act = args[0];
  if (!commands.includes(act)) {
    let del = async () => await message.delete();
    return setTimeout(del, 1000);
  };
  try {
    comms[act].run(message, args, chan, content);
  } catch (err) {
    console.warn(`\n- Erro1: ${err}`);
    //throw err;
  };
});


client.login(Bots[0]); //Ligando o Bot caso ele consiga acessar o token
