const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { ajudas } = require('./ajudas');

var ajuda = {};
ajuda.embed = {
  color: '#2eb89a',
  title: 'AJUDA',
  description: ajudas.geral
};
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

//--------------------------------------------------\\

exports.run = async (inmsg, args, chan) =>
  await inmsg.reply({
    embeds: [ ajuda.embed ],
    components: [ actRow[0] ]
  });

exports.responsive = async (i, message, chan) => {
  let need;   //Usuário que solicitou o menu
  if (message.reference) { //Se for um menu que
                     //respondeu uma mensagem s.forca
    let refChan = message.channel;
    let refMsgId = message.reference.messageId;
    let refMsg = await refChan.messages.fetch(refMsgId);
    need = refMsg.author;
  } else {
    //Se for um menu que respondeu um slash
    need = message.interaction.user;
  };

  if (i.user.id != need.id) return;
  await message.edit({ components: [ actRow[1] ] });
  let embed = { color: '#2eb89a' };

  switch (i.values[0]) {
    case '#':
      embed.title = 'AJUDA - JOGO DA VELHA';
      embed.description = ajudas.velha;
      await message.edit({ embeds: [ embed ] });
    break;
    case 'forca':
      embed.title = 'AJUDA - FORCA';
      embed.description = ajudas.forca;
      await message.edit({ embeds: [ embed ] });
    break;
    case 'reply':
      embed.title = 'AJUDA - REPLY';
      embed.description = ajudas.reply;
      await message.edit({ embeds: [ embed ] });
    break;
    case 'send':
      embed.title = 'AJUDA - SEND';
      embed.description = ajudas.send;
      await message.edit({ embeds: [ embed ] });
    break;
    case 'inicio':
      embed.title = 'AJUDA';
      embed.description = ajudas.geral;
      await message.edit({
        embeds: [ embed ],
        components: [ actRow[0] ]
      });
    break;
  };

};
