const { prefix } = require('../../config.json');

//----------------------------------------------------

module.exports = {

  run: async (message, args, chan) => {
    if (message.type != 'REPLY') {
      return message.reply('Você precisa responder à uma mensagem');
    };

    let reply = message.content.slice(prefix.length).trim().slice(5);
    let destinyId = message.reference.messageId;
    await message.delete();
    await chan.messages.fetch(destinyId)
     .then(message => {
       message.reply(reply);
     })
     .catch(console.error);
  }

};
