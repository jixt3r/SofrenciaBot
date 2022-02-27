const discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (client, message, args) => {
     let text = message.content.slice(9 + args[1].length);
     fs.writeFile('./fazer/' + args[1] + '.txt', text + `\n`, (err) => {
      if (err) throw err;
      });
     message.channel.send("Adicionado à lista");
}
