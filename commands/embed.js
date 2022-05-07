
const { prefix } = require(`${cwd}/config.json`);

//----------------------------------------------------

exports.run = async (message, args, chan, content) => {
  let itens = {};
  content = message.content.slice(prefix.length + 6);
  let argos = content.split('=');
  itens.title = argos[0];
  itens.description = argos[1];
  itens.color = argos[2];
  itens.footer = { text: argos[3] };
  await chan.send({ embeds: [ itens ] });
}; //fecha o exports
