const { comms } = require('../index');
let discoin = comms.discoin;

const tem = (client) => {
  client.application.commands.fetch()
   .then(col => {
     console.log(`- Comandos no bot: ${col.size}`);
     col.each(comm => console.log(` • ${comm.name}`))
   });
};

const Guilds = async (client) => {
  let oGuilds = await client.guilds.fetch()
   .then(col => col.values());
  let guilds = [];
  for (oGuild of oGuilds) {
    guilds.push(await oGuild.fetch());
  };
  return guilds;
};

module.exports = {

  run: async (client) => {
    console.log('\n- Bot pronto. Manda bala!\n');
    tem(client);
    let guilds = await Guilds(client);
    for (guild of guilds) {
      //await filExists(`./db/guilds/${oGuild.id}.json`>
      discoin.init(guild);
    };
  }

};
