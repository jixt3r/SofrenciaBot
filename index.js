
//-------------------Variaveis------------------------

require('dotenv/config');
const { inMili } = require('./files/funcs.js');
const { Client, Intents } = require('discord.js');
const { prefix } = require('./config.json');
const express = require('express');
const app = express();
const ForcaBot = process.env.FORCABOT;
const BotTestes = process.env.TESTESBOT;
const Bots = [BotTestes, ForcaBot];
var forca;
var soccer;
var all = {
  client: new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES]
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

//-------------------Functions------------------------

filter = m => {
  return m.content.toLowerCase().startsWith(prefix);
};

//---------------------Codigo-------------------------

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours (ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});

app.listen(8080) // Recebe solicitações que o deixa online

client.on('ready', async (client) => {
  console.log('\n- Bot pronto. Manda bala!');

  client.channels.fetch('953373127516246017')
   .then(channel => forca = channel)
   .catch(console.error);

  client.channels.fetch('947163868822646824')
   .then(channel => soccer = channel)
   .catch(console.error);

//  await client.guilds.fetch('953373127046467585')
//   .then(async guild => {
//     await guild.members.fetch('393094770794299392')
//      .then(async member => {
//
//      })
//      .catch(console.error);
//   })
//   .catch(console.error);

}); //Fecha client.on ready

client.on('messageCreate', async (message) => {
  //if (message.author.bot) console.log(message.embeds[0].fields[0]);
  //console.log(message);
  if (message.author.bot) return;
  let chan = message.channel;
  content = message.content.toLowerCase();

  if (content.startsWith('.')) {
    try {
      let commandFile = require('./commands/soccer.js');
      return commandFile.run(message);
    } catch (err) {
      console.log("-- Erro no soccer!");
      throw err;
    };
  };

  if (!(content.startsWith(prefix))) return;

  args = content.slice(prefix.length).trim().split(' ');
  let act = args[0];
  try {
    let commandFile = require(`./commands/${act}.js`);
    return commandFile.run(message, args, chan, content, forca);
  } catch (err) {
    console.error('\n- Erro1: ' + err);
    //throw err;
  };
});

client.login(process.env['TOKEN']); //Ligando o Bot caso ele consiga acessar o token
