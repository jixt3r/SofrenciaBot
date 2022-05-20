module.exports = {

  data: {
    name: "ajuda",
    description: "Envia a mensagem de ajuda",
    type: "CHAT_INPUT"
  },

  run: (i) => {
    let commandFile = require(`${cwd}/commands/ajuda.js`);
    commandFile.run(i);
  }

};
