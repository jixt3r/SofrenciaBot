const { inMili } = require('../files/funcs.js');
var timers = {};

ready = (name, msg, timers) => {
  let channel = msg.channel;
  let username = msg.author.username;
  channel.send(`<@${msg.author.id}> O **${name}** estâ pronto!`)
  //timers[channel.id][username][name] = undefined;
};

//------------------------------------------------

module.exports.run = async (message) => {
  let user = message.author;
  let username = user.username;
  let channel = message.channel;
  let content = message.content;
  let command = content.slice(1);

  if (!timers[channel.id]) {
    timers[channel.id] = {};
  };
  if (!timers[channel.id][username]) {
    timers[channel.id][username] = {};
  };

  switch (command) {
    case 'claim':
     const claimFilter = m => {
      try {
       return m.embeds[0].description.startsWith(`<@${user.id}> você está com tempo de espera`);
      } catch (err) {
       return false;
      };
     };
     await channel.awaitMessages({ filter: claimFilter, max: 1, time: 6_000})
      .then(collected => {
        msg = collected.first();
        if (msg) {
         console.log("- Foi recebida mensagem de esperar");
         return;
        };
        console.log("- Não foi recebida mensagem de esperar");

        timers[channel.id][username].claim = setTimeout(ready, inMili('00:59:50'), "claim", message, timers)
        console.log("Timeout claim definido");

  //      timers[channel.id][username].daily = setTimeout(ready, inMili('00:59:50'), "daily", message, timers)
//        console.log(`Timeout daily definido`);

      })
      .catch(console.error);
      //friendly
      //arena
  }
} //fecha o modulo.exports
