module.exports = {

  data: {
    name: "send",
    description: "Envia uma mensagem através do bot",
    type: "CHAT_INPUT",
    options: [{
      type: "STRING",
      name: "mensagem",
      description: "Mensagem que será enviada pelo bot.",
      required: true
    }]
  },

  run: async (i) => {
    await i.channel.send(i.options.getString('mensagem'));
    await i.reply('Success!');
    await i.deleteReply();
  }

};
