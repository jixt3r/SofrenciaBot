const { comms, slashs } = require('../index');

module.exports = {

  run: (i) => {
    let msg = i.message;
    let chan = i.channel;

    if (i.isCommand()) {
      let name = i.commandName;
      if (slashs[name]) {
        return slashs[name].run(i);
      };
    };

    if (i.isSelectMenu()) {
      return comms.ajuda.responsive(i, msg, chan);
    };

    if (i.channel.parent.name == 'Discoin') {
      return comms.discoin.responsive(i, msg, chan);
    };
  }

};
