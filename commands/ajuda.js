const { MessageActionRow, MessageSelectMenu } = require('discord.js');
//const {} = require('../files/funcs.js');
const { prefix } = require('../config.json');

code = (text) => {
  return '`' + text + '`';
};

const ajudas = {
  geral: `
• Prefixo para comandos: ${code(prefix)}

• Pode usar letras maiúsculas ou minúsculas sem problemas

• Comandos disponíveis: **#, Forca, Reply e Send**`,

  forca: `
• Para iniciar o jogo use o comando ${code('forca')}

• Para tentar uma letra use ${code(prefix + 'LETRA')}
   - **Exemplo:** Use ${code(prefix + 'a')} para tentar a letra **A**

• Para vencer é necessário tentar a palavra certa. Se acertar todas as letras sem tentar a palavra, você perde

• Para tentar uma palavra use ${code(prefix + 'PALAVRA')}
   - **Exemplo:** Use ${code(prefix + 'porta')} para tentar a palavra **porta**

• Para pedir uma dica use ${code(prefix + 'dica')}

• Se tiverem muitas mensagens após a mensagem da forca, use ${code(prefix + 'up')} para reenviar a mensagem

• O jogo dura no máximo **6 minutos e 40s**, se chegar à isso o jogador perde

• Para terminar o jogo use ${code(prefix + 'end')}`,

  velha: `
• Para iniciar o jogo use o comando ${code('#')} e mencione um usuário junto do comando para jogar com ele. Pode ser você mesmo

• O usuário mencionado terá que aceitar o convite de jogo na mensagem que aparecerá em até 1 minuto

• O primeiro a jogar é quem fez o convite

• Para posicionar os símbolos use ${code(prefix + 'NUMERODAPOSIÇÃO')}
   - Substitua ${code('NUMERODAPOSIÇÃO')} pelo numero do quadrado que escolheu

• A partida dura no máximo **6 minutos e 40s**, se chegar à isso o jogo acaba

• Para terminar o jogo use ${code(prefix + 'end')}`,

  reply: `
• Responda uma mensagem com ${code(prefix + 'reply =MENSAGEM')} para que o bot responda essa mesma mensagem com o texto que quiser
   - Substitua ${code('MENSAGEM')} pelo texto que será enviado`,

  send: `
• Use o comando ${code(prefix + 'send =MENSAGEM')} para fazer o bot enviar uma mensagem
   - Substitua ${code('MENSAGEM')} pelo texto que será enviado`
};
var ajuda = {};
ajuda.itens = { color: '#2eb89a', title: 'AJUDA',
  description: ajudas.geral };
var menus = [];
var actRow = [];

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

//----------------------------------------------------

exports.run = async (msg, args, chan) => {
  if (args == 'interaction') {
    let i = msg;
    await i.reply({ embeds: [ ajuda.itens ],
    components: [ actRow[0] ] });
    return;
  };
  await msg.reply({ embeds: [ ajuda.itens ],
    components: [ actRow[0] ] });
};

exports.responsive = async (i, message) => {
  let need;
  if (message.reference) {
    let refChan = message.channel;
    let refMsgId = message.reference.messageId;
    let refMsg = await refChan.messages.fetch(refMsgId);
    need = refMsg.author;
  } else {
    need = message.interaction.user;
  };
  if (i.user.id != need.id) return;
  await message.edit({ components: [ actRow[1] ] });
  let itens = { color: '#2eb89a' };
  switch (i.values[0]) {
    case '#':
      itens.title = 'AJUDA - JOGO DA VELHA';
      itens.description = ajudas.velha;
      await message.edit({ embeds: [ itens ] });
    break;
    case 'forca':
      itens.title = 'AJUDA - FORCA';
      itens.description = ajudas.forca;
      await message.edit({ embeds: [ itens ] });
    break;
    case 'reply':
      itens.title = 'AJUDA - REPLY';
      itens.description = ajudas.reply;
      await message.edit({ embeds: [ itens ] });
    break;
    case 'send':
      itens.title = 'AJUDA - SEND';
      itens.description = ajudas.send;
      await message.edit({ embeds: [ itens ] });
    break;
    case 'inicio':
      itens.title = 'AJUDA';
      itens.description = ajudas.geral;
      await message.edit({
        embeds: [ itens ],
        components: [ actRow[0] ]
      });
    break;
  };
};
