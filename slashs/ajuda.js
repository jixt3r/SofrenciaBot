exports.data = {
  name: "ajuda",
  description: "Envia a mensagem de ajuda",
  type: "CHAT_INPUT"
};

exports.run = (i) => {
  let commandFile = require(`${cwd}/commands/ajuda.js`);
  commandFile.run(i, 'interaction');
};
