const { embedMess, capit } = require('../files/funcs.js');
const config = require('../config.json');
const ajudas = {
  geral: '• Os comandos devem começar com "**' + config.prefix + '**";\n\n' +
         '• Pode usar letras maiúsculas ou minúscula sem problemas.\n\n' +
         '• Comandos: **Forca**. (Só tem esse)\n\n' +
         '• Para ver a ajuda de um comando use o nome do comando depois de **<prefixo>.ajuda**.',

  forca: '• Para iniciar o jogo use o comando **forca**;\n\n' +
         '• Para tentar uma letra use **<prefixo>.letra**;\n' +
         '- **Exemplo**: Use **' + config.prefix + 'a** para tentar a letra **A**;\n\n' +
         '• Para vencer é necessário tentar a palavra certa. Se acertar todas as letras sem tentar a palavra, você perde.\n\n' +
         '• Para tentar uma palavra use **<prefixo>.palavra**;\n' +
         '- **Exemplo**: Use **' + config.prefix + 'porta** para tentar a palavra **porta**;\n\n' +
         '• Se usar uma palavra de tamanho diferente da palavra a ser descoberta, a primeira letra será considerada como tentativa;\n' +
         '- **Exemplo**: Se a palavra a ser descoberta for **carreta** e a tentativa for **barro** a letra considerada será **B**;\n\n' +
         '• Para pedir uma dica use o comando **dica**;\n\n' +
         '• O limite de tempo do jogo é **6 minutos e 40s**, se chegar à isso o jogador perde;\n\n' +
         '• Para terminar o jogo use o comando **end**.'
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

module.exports.run = (all) => {
  args = all.args;
  message = all.message;
  if (args.length == 1) {
    itens.title = 'Ajuda'
    itens.desc = ajudas.geral;
    message.channel.send({ embeds: [embedMess(itens)]});
  return;
  }
  itens.title = 'Ajuda sobre **' + args[1].capit() + '**';
  itens.desc = ajudas[args[1].toLowerCase()];
  message.channel.send({ embeds: [embedMess(itens)]});
} //fecha o modulo.exports
