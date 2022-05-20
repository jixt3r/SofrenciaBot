const { inMili } = require('../../files/funcs.js');
var timers = {};
var filters = {};

filters.claim = m => {
  try {
    return m.embeds[0].description.startsWith(`<@${user.id}> você está com tempo de espera`);
  } catch (err) {
    return false;
  };
};

ready = (name, msg, soccer) => {
  let chan = msg.channel;
  let username = msg.author.username;
  soccer.send(`<@${msg.author.id}> O **${name}** estâ pronto!`)
  timers[chan.id][username][name] = undefined;
};

//------------------------------------------------

module.exports.run = async (message, soccer) => {
  let chan = message.channel;

  if (chan.id != soccer.id) return;

  user = message.author;
  let username = user.username;
  let content = message.content;
  let act = content.slice(1);

  if (!timers[chan.id]) {
    timers[chan.id] = {};
  };
  if (!timers[chan.id][username]) {
    timers[chan.id][username] = {};
  };

  switch (act) {
    case 'claim':
      await chan.awaitMessages({ filter: filters.claim, max: 1, time: 6_000})
       .then(collected => {
         let msg = collected.first();
         console.log(`- msg:
${msg}`);
         if (msg) {
           console.log("- Foi recebida mensagem de esperar");
           if (!timers[chan.id][username].claim) {
             let time = msg.embeds[0].description.slice(-10, -2);
             timers[chan.id][username].claim = setTimeout(ready, inMili(time), "claim", message, soccer)
             console.log(`- Timeout claim definido com ${time}`);
           };
           return;
         };
         console.log("- O claim foi coletado");
         timers[chan.id][username].claim = setTimeout(ready, inMili('01:00:00'), "claim", message, soccer)
         console.log("- Timeout claim definido com 1 hora");
       })
       .catch(console.error);
    break;
//daily
//friendly
//arena

  }; //Fecha o switch
}; //Fecha o modulo.exports
