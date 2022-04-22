require('dotenv/config');
const { Client, Intents } = require('discord.js');
const slashs = require('./files/slashs.json');
const SofreBot = process.env.SOFREBOT;
const BotTestes = process.env.TESTESBOT;
const Bots = [BotTestes, SofreBot];

print = (text) => {
  console.log(text);
};

addComm = async (client, data) => {
  await client.application.commands.fetch()
   .then(async (col) => {
     let comm = col.find(comm => comm.name == data.name);
     if (comm) {
       await comm.delete();
       print('- Já havia um comando com este nome, ele foi deletado e substituído');
     };
   });
  let cmd = client.application.commands.create(data);
  print("- Comando, caralho!");
 return cmd;
};

delComm = async (client, name) => {
  await client.application.commands.fetch()
   .then(col => {
     let take = col.find(comm => comm.name == name);
     if (take) {
      take.delete()
       .then(print("\n- Comando deletado"));
     } else {
       print("- Não existe esse comando");
     };
   });
};

client = new Client({ intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES]
});

run = async () => {
  await client.login(Bots[0]);
  //addComm(client, slashs.reply);
  //delComm(client, 'reply')
  client.application.commands.fetch()
   .then(col => print(col.size));
};

run();
