const { embedMess, capit } = require('../files/funcs.js');
const { prefix } = require('../config.json');
//const prefix = config.prefix;

//------------------------------------------------

module.exports.run = async (message, args, chan, content, forca) => {
  try {
    let msg = content.split('=')[1].trim();
    if (chan.type != 'DM') {
      await message.delete();
      chan.send(msg);
    } else {
      forca.send(msg);
    };
  } catch (err) {}
} //Fecha o module.exports
