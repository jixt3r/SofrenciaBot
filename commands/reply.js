
//------------------------------------------------

module.exports.run = async (message, args, chan) => {
  if (message.type != 'REPLY') {
    message.reply('Você precisa responder à uma mensagem');
    return;
  };

  reply = message.content.split('=')[1];
  destinyId = message.reference.messageId;
  await message.delete();
  chan.messages.fetch(destinyId)
   .then(message => {
     message.reply(reply);
   })
   .catch(console.error);
} //fecha o modulo.exports
