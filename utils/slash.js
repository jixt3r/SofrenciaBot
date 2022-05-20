let modes = [ 'see', 'add', 'del' ];
let mode = process.argv[2];
if (!modes.includes(mode)) return;

const slash = (name) => {
  let file = require(`./slashs/${name}.js`);
  return file.data;
};

adds = [ 'ajuda', 'send' ];
dels = [];

require('dotenv/config');
const { Client, Intents } = require('discord.js');
const SofreBot = process.env.SOFREBOT;
const BotTestes = process.env.TESTESBOT;
const Bots = [ BotTestes, SofreBot ];

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

main = async () => {
  await client.login(Bots[0]);
  if (mode == 'see') {
    await tem();
    await client.destroy();
    return;
  };
  if (mode == 'add') {
    if (!adds) console.log('\n- adds está vazio');
    await addComm(adds);
  }
  if (mode == 'del') {
    if (!dels) console.log('\n- dels está vazio!');
    await delComm(dels);
  };
  setTimeout( async () => {
    await tem();
    await client.destroy();
  }, 1000);
};

tem = async () => {
  await client.application.commands.fetch()
   .then( col => {
    console.log(`\n- Comandos existentes no bot: ${col.size}`);
    col.each(comm => console.log(` • ${comm.name}`));
   });
};

addComm = async (slashs) => {
  await client.application.commands.fetch()
   .then(async (col) => {
     await slashs.forEach( async (val, ind, arr) => {
       let comm = await col.find(comm => comm.name == val.name);
       if (comm) {
         await console.log(`\n- Um comando com o nome "${comm.name}" já está no bot`);
         stop = true;
       } else stop = false;
       if (!stop) {
         await client.application.commands.create(val);
         await console.log(`\n- O comando "${val.name}" foi criado.`);
       };
     });
   });
};

delComm = async (names) => {
  await client.application.commands.fetch()
   .then( async col => {
     await names.forEach( async (val, ind, arr) => {
       let take = await col.find(comm => comm.name === val);
       if (take) {
         await take.delete()
          .then(console.log(`\n- O comando "${take.name}" foi deletado.`));
       } else {
         console.log(`\n- Não tem comando "${val}" no bot.`);
       };
     });
   });
  //setTimeout(tem, 6_400);
};

main();
