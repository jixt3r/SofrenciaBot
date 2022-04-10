
//-------------------Variaveis--------------------
const config = require('../config.json');
var user = {};
var invited;
var rodada = 0;
const { embedMess, remoji } = require('../files/funcs.js');
const rodadas = ["O", "X", "O", "X", "O",
                   "X", "O", "X", "O"];
const emojis = ['1️⃣', '2️⃣', '3️⃣',
                '4️⃣', '5️⃣', '6️⃣',
                '7️⃣', '8️⃣', '9️⃣']
var grade = [
  '!', '!', '!', // 0 1 2
  '!', '!', '!', // 3 4 5
  '!', '!', '!'  // 6 7 8
];

var itens = {
  color: '#c0c0c0',
  title: 'Jogo da velha',
  desc: '',
  footer: {
   text: ''
  }
};

//--------------------Funcoes---------------------

textGrade = (grade) => {
  let text = '';
  for(let i = 0; i < 9; i++) {
    if (grade[i] == 'X') {
      text = text + ':regional_indicator_x: ';
    } else if (grade[i] == 'O') {
      text = text + ':regional_indicator_o: '
    } else {
       text = text + emojis[i] + ` `;
    };
    if (i == 2 || i == 5)  {
      text = text + '\n'
    };
  };
  return text;
}

venceu = (grade) => {
  for (let l = 0; l < 7; l += 3) {
    if (grade[l] == grade[l + 1] && grade[l + 1] == grade[l + 2]) {
      return grade[l];
    };
  }; //Confere vitorias horizontais

  for (let c = 0; c < 3; c++) {
    if (grade[c] == grade[c + 3] && grade[c + 3] == grade[c + 6]) {
      return grade[c];
    };
  }; //Confere vitorias verticais

  //Confere vitorias diagonais
  if (grade[0] == grade[4] && grade[4] == grade[8]) {
    return grade[0];
  };
  if (grade[2] == grade[4] && grade[4] == grade[6]) {
    return grade[2];
  };
  return false;

//Combinacoes de vitorias
//012 147 852
//036 345 876
//048 246
};

end = (itens) => {
  itens.footer.text = '';
  return;
};

//------------------------------------------------

module.exports.run = async (all) => {
  //Simplifica variaveis
  client = all.client;
  message = all.message;
  ativo = all.ativo;
  channel = message.channel;
  args = all.args;
  user = message.author;

  if (!ativo) {
    invited = args[1];
    players = [user.id, invited.slice(2, 20)]
    if (!invited.startsWith('<@')) {
      message.reply('Falta um usuário para jogar junto');
      return;
    };

    //Prepara a mensagem do convite
    itens.desc = `<@${user.id}> desafia ${invited} para um jogo da velha.
${invited}, reaja à esta mensagem com 👍 para aceitar, ou com 👎 para recusar o desafio.`,
    answ = await channel.send({ embeds: [embedMess(itens)]});
    var like = await answ.react("👍");
    var dislike = await answ.react("👎");

    const filter = (reaction, user) => {
      let reactions = ["👍", "👎"];
      return reactions.includes(reaction.emoji.name) && user.id == invited.slice(2, 20);
    };

    answ.awaitReactions({ filter: filter, max: 1, time: 60_000, errors: ['time'] })
     .then(async collected => {
      if (collected.first().emoji.name === '👎') {
        itens.title = 'Convite recusado!';
        itens.desc = `${invited} recusou o desafio!`;
        itens.footer.text = ':(';
        await like.remove();
        await dislike.remove();
        answ.edit({ embeds: [embedMess(itens)]});
      } else {
        all.ativos[message.channelId] = {};
        all.ativos[message.channelId].servico = '#';
        itens.title = 'Jogo da velha';
        itens.desc = textGrade(grade);
        itens.footer.text = '';
        await like.remove();
        await dislike.remove();
        answ.edit({ embeds: [embedMess(itens)]});
      }
     })
     .catch(async err => {
      itens.title = 'Que demora!';
      itens.desc = 'O desafio foi cancelado!';
      itens.footer.text = '(×_×)';
      await like.remove();
      await dislike.remove();
      answ.edit({ embeds: [embedMess(itens)]});
      end(itens);
     });
  } else {
    if (!players.includes(message.author.id)) return;
    let pos = args[0].slice(config.prefix.length);
    if (!(0 < pos && pos < 10)) {
      message.delete();
      return;
    };
    if (!second && first && message.author.id != first) {
      var second = message.author.id;
    };
    if (!first) {
      var first = message.author.id;
    };
    grade[pos - 1] = rodadas[rodada];
    rodada++;
    itens.desc = textGrade(grade);
    message.delete();
    answ.edit({ embeds: [embedMess(itens)]});
  }
};
