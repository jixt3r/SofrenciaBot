const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { capit } = require('../files/funcs.js');
const { prefix } = require('../config.json');
const ajudas = {
  geral: `
• Prefixo para comandos: **${prefix}**

• Pode usar letras maiúsculas ou minúsculas sem problemas

• Comandos disponíveis: **#, Forca, Reply e Send**`,

  forca: `
• Para iniciar o jogo use o comando **forca**

• Para tentar uma letra use **${prefix}letra**
   - **Exemplo:** Use **${prefix}a** para tentar a letra **A**

• Para vencer é necessário tentar a palavra certa. Se acertar todas as letras sem tentar a palavra, você perde

• Para tentar uma palavra use **${prefix}palavra**
   - **Exemplo:** Use **${prefix}porta** para tentar a palavra **porta**

• Para pedir uma dica use **${prefix}dica**

• Se tiverem muitas mensagens após a mensagem da forca, use **${prefix}up** para reenviar a mensagem

• O jogo dura no máximo **6 minutos e 40s**, se chegar à isso o jogador perde

• Para terminar o jogo use **${prefix}end**`,

  velha: `
• Para iniciar o jogo use o comando **#** e mencione um usuário junto do comando para jogar com ele. Pode ser você mesmo

• O usuário mencionado terá que aceitar o convite de jogo na mensagem que aparecerá em até 1 minuto

• O primeiro a jogar é quem fez o convite

• Para posicionar os símbolos use **${prefix}NUMERODAPOSIÇÃO**
   - Substitua NUMERODAPOSIÇÃO pelo numero do quadrado que escolheu

• A partida dura no máximo **6 minutos e 40s**, se chegar à isso o jogo acaba

• Para terminar o jogo use **${prefix}end**`,

  reply: `
• Responda uma mensagem com **${prefix}reply =MENSAGEM** para que o bot responda essa mesma mensagem com o texto que quiser
   - Substitua **MENSAGEM** pelo texto que será enviado`,

  send: `
• Use o comando **${prefix}send =MENSAGEM** para fazer o bot enviar uma mensagem
   - Substitua **MENSAGEM** pelo texto que será enviado`
};
var all = {};
var menus = [];
var actRow = [];

filter = (i) => {
  return i.user.id == src.user.id;
};

menus[0] = new MessageSelectMenu({
  customId: 'Ajudas',
  placeholder: 'Ajuda sobre o comando...',
  options: [
    { label: '#', value: '#', description: 'Comando para jogar Jogo Da Velha', emoji: '#️⃣' },
    { label: 'Forca', value: 'forca', description: 'Comando para jogar Forca', emoji: '💀' },
    { label: 'Reply', value: 'reply', description: 'Comando para fazer o bot responder mensagens', emoji: '📨' },
    { label: 'Send', value: 'send', description: 'Comando para fazer o bot enviar mensagens', emoji: '📤' }
  ]
});

menus[1] = new MessageSelectMenu({
  customId: 'Ajudas',
  placeholder: 'Ajuda sobre o comando...',
  options: [
    { label: '#', value: '#', description: 'Comando para jogar Jogo Da Velha', emoji: '#️⃣' },
    { label: 'Forca', value: 'forca', description: 'Comando para jogar Forca', emoji: '💀' },
    { label: 'Reply', value: 'reply', description: 'Comando para fazer o bot responder mensagens', emoji: '📨' },
    { label: 'Send', value: 'send', description: 'Comando para fazer o bot enviar mensagens', emoji: '📤' },
    { label: 'Voltar ao início', value: 'inicio', description: '', emoji: '↩️' }
  ]
});

actRow[0] = new MessageActionRow({
  components: [ menus[0] ]
});

actRow[1] = new MessageActionRow({
  components: [ menus[1] ]
});

String.prototype.capit = capit;

//------------------------------------------------

module.exports.run = async (message, args, chan, content) => {
  let user = message.author;
  if (all[user.id]) {
    src = all[user.id];
  } else {
    all[user.id] = {};
    src = all[user.id];
  };
  src.user = user;
  src.itens = {};
  src.itens.title = 'AJUDA';
  src.itens.description = ajudas.geral;
  src.answ = await chan.send({
    embeds: [ src.itens ],
    components: [ actRow[0] ]
  });
  src.collector = src.answ.createMessageComponentCollector({ filter: filter, time: 60_000 })
  src.collector.on('collect', i => {
    //console.log(i);
    src.answ.edit({ components: [ actRow[1] ] });
    switch (i.values[0]) {
      case '#':
        src.itens.title = 'AJUDA - JOGO DA VELHA';
        src.itens.description = ajudas.velha;
        src.answ.edit({
          embeds: [ src.itens ]});
      break;
      case 'forca':
        src.itens.title = 'AJUDA - FORCA';
        src.itens.description = ajudas.forca;
        src.answ.edit({
          embeds: [ src.itens ]});
      break;
      case 'reply':
        src.itens.title = 'AJUDA - REPLY';
        src.itens.description = ajudas.reply;
        src.answ.edit({
          embeds: [ src.itens ]});
      break;
      case 'send':
        src.itens.title = 'AJUDA - SEND';
        src.itens.description = ajudas.send;
        src.answ.edit({
          embeds: [ src.itens ]});
      break;
      case 'inicio':
        src.itens.title = 'AJUDA';
        src.itens.description = ajudas.geral;
        src.answ.edit({
          embeds: [ src.itens ],
          components: [ actRow[0] ]
        });
      break;
    };
  });
}; //Fecha o module.exports
