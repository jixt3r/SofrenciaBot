const { embedMess, capit } = require('../files/funcs.js');
const config = require('../config.json');
const prefix = config.prefix;
const ajudas = {
  geral: `• Os comandos devem começar com **${prefix}**;

• Pode usar letras maiúsculas ou minúsculas sem problemas;

• Comandos disponíveis: **Forca, send, reply**;

• Para ver a ajuda de um comando use o nome do comando depois de **${prefix}ajuda**.`,

  forca: `• Para iniciar o jogo use o comando **forca**;

• Para tentar uma letra use **${prefix}letra**;
   - **Exemplo**: Use **${prefix}a** para tentar a letra **A**;

• Para vencer é necessário tentar a palavra certa. Se acertar todas as letras sem tentar a palavra, você perde;

• Para tentar uma palavra use **${prefix}palavra**;
   - **Exemplo**: Use **${prefix}porta** para tentar a palavra **porta**;

• Para pedir uma dica use **${prefix}dica**;

• Se tiverem muitas mensagens após a mensagem da forca, use **${prefix}up** para reenviar a mensagem;

• O limite de tempo do jogo é **6 minutos e 40s**, se chegar à isso o jogador perde;

• Para terminar o jogo use **${prefix}end**.`
};

String.prototype.capit = capit;

var itens = {
  color: '#0099ff',
  //author: {
  //  name: 'SofrenciaBot',
  //  url: '',
  //  iconUrl: ''
  //  proxyIconUrl: ''
  //},
  //url: '',
  title: '',
  //thumb: {
  //  url: '',
  //  proxyURL: 'none',
  //  height: 0,
  //  width: 0
  //},
  desc: '',
  //fields: [{
  //  name: 'Testando',
  //  value: 'k\r\nj',
  //  inline: false
  //}],
  //image: ,
  //video: ,
  footer: {
    text: ''
    //iconUrl: ''
    //proxyIconUrl: ''
  }
};

//------------------------------------------------

module.exports.run = (message, args, chan, content) => {
  if (args.length == 1) {
   itens.title = 'Ajuda'
   itens.desc = ajudas.geral;
   chan.send({ embeds: [embedMess(itens)]});
   return;
  };
  itens.title = `Ajuda sobre **${args[1].capit()}**`;
  itens.desc = ajudas[args[1].toLowerCase()];
  chan.send({ embeds: [embedMess(itens)]});
} //Fecha o module.exports
