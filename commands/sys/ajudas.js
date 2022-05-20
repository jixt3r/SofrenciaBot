const { prefix } = require('../../config.json');

const ajudas = {};

const code = (text) => '`' + text + '`';

ajudas.geral = `
• Prefixo para comandos: ${code(prefix)}

• Pode usar letras maiúsculas ou minúsculas sem problemas

• Comandos disponíveis: **#, Forca, Reply e Send**`;


ajudas.forca = `
• Para iniciar o jogo use o comando ${code('forca')}

• Para tentar uma letra use ${code(prefix + 'LETRA')}
   - **Exemplo:** Use ${code(prefix + 'a')} para tentar a letra **A**

• Para vencer é necessário tentar a palavra certa. Se acertar todas as letras sem tentar a palavra, você perde

• Para tentar uma palavra use ${code(prefix + 'PALAVRA')}
   - **Exemplo:** Use ${code(prefix + 'porta')} para tentar a palavra **porta**

• Para pedir uma dica use ${code(prefix + 'dica')}

• Se tiverem muitas mensagens após a mensagem da forca, use ${code(prefix + 'up')} para reenviar a mensagem

• O jogo dura no máximo **6 minutos e 40s**, se chegar à isso o jogador perde

• Para terminar o jogo use ${code(prefix + 'end')}`;


ajudas.velha = `
• Para iniciar o jogo use o comando ${code('#')} e mencione um usuário junto do comando para jogar com ele. Pode ser você mesmo

• O usuário mencionado terá que aceitar o convite de jogo na mensagem que aparecerá em até 1 minuto

• O primeiro a jogar é quem fez o convite

• Para posicionar os símbolos use ${code(prefix + 'NUMERODAPOSIÇÃO')}
   - Substitua ${code('NUMERODAPOSIÇÃO')} pelo numero do quadrado que escolheu

• A partida dura no máximo **6 minutos e 40s**, se chegar à isso o jogo acaba

• Para terminar o jogo use ${code(prefix + 'end')}`;


ajudas.reply = `
• Responda uma mensagem com ${code(prefix + 'reply =MENSAGEM')} para que o bot responda essa mesma mensagem com o texto que quiser
   - Substitua ${code('MENSAGEM')} pelo texto que será enviado`;


ajudas.send = `
• Use o comando ${code(prefix + 'send =MENSAGEM')} para fazer o bot enviar uma mensagem
   - Substitua ${code('MENSAGEM')} pelo texto que será enviado`;


module.exports = {

  ajudas

};
