require('dotenv/config');
const { Client, Intents } = require('discord.js');
const fs = require('fs');
cwd = process.cwd();
const SofreBot = process.env.SOFREBOT;
const BotTestes = process.env.TESTESBOT;
const Bots = [BotTestes, SofreBot];
const client = new Client({
  presence: {
    activities: [
      { name: 'A galera do SOFRENCIA y SOLIDÃO', type: 'WATCHING' }]},
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES ]
});

// Intents: "GUILDS" "GUILD_MEMBERS" "GUILD_BANS"
//"GUILD_EMOJIS_AND_STICKERS" "GUILD_INTEGRATIONS"
//"GUILD_WEBHOOKS" "GUILD_INVITES"
//"GUILD_VOICE_STATES" "GUILD_PRESENCES"
//"GUILD_MESSAGES" "GUILD_MESSAGE_REACTIONS"
//"GUILD_MESSAGE_TYPING" "DIRECT_MESSAGES"
//"DIRECT_MESSAGE_REACTIONS"
//"DIRECT_MESSAGE_TYPING" "GUILD_SCHEDULED_EVENTS"

//-------------------- Funções ---------------------\\

const mapDir = (dir) => {
  const all = fs.readdirSync(dir);
  let map = { files: [], folds: [] };
  for(let i = 0; i < all.length; i++)
    if (all[i].includes('.')) map.files.push(all[i])
      else map.folds.push(all[i]);

  for (fold of map.folds)
    map[fold] = mapDir(`${dir}/${fold}`);
  return map;
};

//const load = (map, dir) => {
//  let obj = {};
//  for (file of map.files)
//    obj[file.slice(0, -3)] = require(`${dir}/${file}`);

//  for (fold of map.folds)
//    obj[fold] = load(map[fold], `${dir}/${fold}`);

//  return obj;
//};

const loadComms = (map, dir, obj) => {
  for (file of map.files)
    obj[file.slice(0, -3)] = require(`${dir}/${file}`);
  for (fold of map.folds)
    if (fold != 'off')
      loadComms(map[fold], `${dir}/${fold}`, obj);
};

//filExists = async (file) => {
//  fs.readFile(file, 'utf-8', async (err, data) => {
//    if (!err) return;
//    await fs.writeFile(file, '{}', (err) => {})
//  });
//};

//------------------- Código -----------------------\\

let comms = {};
let commsMap = mapDir('./commands');
//const comms = load(commsMap, './commands');
loadComms(commsMap, './commands', comms);
exports.comms = comms;
//console.log(comms);
let slashs = {};
let slashsMap = mapDir('./slashs');
//const slashs = load(slashsMap, './slashs');
loadComms(slashsMap, './slashs', slashs);
exports.slashs = slashs;

let events = {};
let eventsMap = mapDir('./client-events');
//const events = load(eventsMap, './client-events');
loadComms(eventsMap, './client-events', events);

client.on('ready', async (client) => {
  await events.ready.run(client);
});

client.on('interactionCreate', async (i) => {
  await events.interCreate.run(i);
});

client.on('messageCreate', async (message) => {
  await events.msgCreate.run(message);
});

client.login(Bots[0]); //Ligando o Bot caso ele consiga acessar o token
