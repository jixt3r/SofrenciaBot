
//------------------------------------------------

module.exports.run = async (all) => {
  message = all.message;
  channel = message.channel;
  if (message.type != 'REPLY') return;
  reply = message.content.split('=')[1];
  destinyId = message.reference.messageId;
  //await message.delete();
  channel.messages.fetch(destinyId)
   .then(message => {
     console.log(message);
     message.reply(reply);
   })
   .catch(console.error);
} //fecha o modulo.exports
