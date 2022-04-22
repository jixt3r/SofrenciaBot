const { Client } = require('discord.js');
const slashs = require('./files/slashs.json');
const SofreBot = process.env.SOFREBOT;
const BotTestes = process.env.TESTESBOT;
const Bots = [BotTestes, SofreBot];

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
     if (take) take.delete();
   });
};

client = new Client();

client.login(Bots[0]);

addComm(client, slashs.tal);
