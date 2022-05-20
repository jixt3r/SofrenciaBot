const snow = new RegExp('[0-9]{17}');
const { prefix } = require('../config.json');
const { comms } = require('../index');

module.exports = {

  run: async (msg) => {
    //if (msg.author.bot) return;
    //let ref = await msg.channel.messages.fetch(message.reference.messageId);
    //console.log(ref.embeds[0]);
    //let commandFile = require(`./i.js`);
    //return commandFile.run(msg);

    let chan = msg.channel;
    if (snow.test(chan.topic)) {
      try {
        return comms.discoin.responsive(null, msg, chan);
      } catch (err) {
        return console.warn(`\n- Erro7: ${err}`);
        //throw err;
      };
    };

    if (msg.author.bot) return;

    let content = msg.content.toLowerCase();
    if (!content.startsWith(prefix)) return;

    let args = content.slice(prefix.length).trim().split(' ');
    let command = args[0];
    args.shift();
    if (!comms[command]) {
      let del = async () => await msg.delete();
      return setTimeout(del, 1000);
    };
    try {
      comms[command].run(msg, args, chan, content);
    } catch (err) {
      console.warn(`\n- Erro1: ${err}`);
      //throw err;
    };
  }

};
