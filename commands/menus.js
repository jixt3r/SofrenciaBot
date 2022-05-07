const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const { prefix } = require('../config.json');

code = (text) => {
  return '`' + text + '`';
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
