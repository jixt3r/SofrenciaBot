
//------------------------------------------------

module.exports.run = async (message, args, chan) => {
  if (message.type != 'REPLY') return;

  reply = message.content.split('=')[1];
  destinyId = message.reference.messageId;
  await message.delete();
  chan.messages.fetch(destinyId)
   .then(message => {
     message.reply(reply);
   })
   .catch(console.error);
} //fecha o modulo.exports
