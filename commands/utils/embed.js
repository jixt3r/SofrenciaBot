const { prefix } = require(`${cwd}/config.json`);

//--------------------------------------------------\\

module.exports = {

  run: async (message, args, chan) => {
    let embed = {};
    let content = message.content.slice(prefix.length + 6);
    let argos = content.split('=');
    embed.title = argos[0];
    embed.description = argos[1];
    embed.color = argos[2];
    embed.footer = { text: argos[3] };
    await chan.send({ embeds: [ embed ] });
  }

};
