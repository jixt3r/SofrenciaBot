const { embedMess, capit } = require(`${cwd}/files/funcs.js`);
const { prefix } = require(`${cwd}/config.json`);

//--------------------------------------------------\\

module.exports = {

  run: async (message, args, chan) => {
    try {
      let msg = message.content.slice(prefix.length).trim().slice(4);
      await message.delete();
      await chan.send(msg);
    } catch (err) {};
  }

};
