
//-------------------Variaveis--------------------
const config = require('../config.json');
var all = {};
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
const filter = (reaction, user) => {
  let reactions = ["👍", "👎"];
  return reactions.includes(reaction.emoji.name) && user.id == src.players[1];
};
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
    if (i == 2 || i == 5) {
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

end = () => {
  all[chan.id] = undefined;
};

//------------------------------------------------

module.exports.run = async (message, args, chan) => {
  if (all[chan.id]) {
    src = all[chan.id];
  } else {
    all[chan.id] = {};
    src = all[chan.id];
  };

  if (src.ativo) return;

  await chan.guild.members.fetch(args[1].slice(2, 20))
   .then(invited => {
     if (!invited) {
       message.reply('Este usuário não está disponível');
       return;
     };
   })
   .catch(console.error);

  src.userId = message.author.id;
  src.invited = args[1];
  src.players = [src.userId, src.invited.slice(2, 20)]
  src.first = src.players[0];
  src.second = src.players[1];

  

  //Prepara a mensagem do convite
  src.itens.desc = `${src.invited}, <@${src.userId}> quer jogar jogo da velha com você.
Reaja com 👍 para aceitar, ou com 👎 para recusar.`;
  src.answ = await chan.send({ embeds: [embedMess(src.itens)]});
  src.like = await src.answ.react("👍");
  src.dislike = await src.answ.react("👎");

  await src.answ.awaitReactions({ filter: filter, max: 1, time: 60_000, errors: ['time'] })
   .then(async collected => {
     let reaction = collected.first().emoji.name;
     switch (reaction) {
       case '👎':
         src.itens.title = 'Convite recusado!';
         src.itens.desc = `${invited} não quer jogar.`;
         src.itens.footer.text = ':(';
         await src.dislike.remove();
         await src.like.remove();
         src.answ.edit({ embeds: [embedMess(src.itens)]});
         console.log('caiu no deslike');
         return;
       break;
     };
   })
   .catch(async err => {
     src.itens.title = 'Que demora!';
     src.itens.desc = 'O desafio foi cancelado!';
     src.itens.footer.text = '(×_×)';
     await src.dislike.remove();
     await src.like.remove();
     src.answ.edit({ embeds: [embedMess(src.itens)]});
     end();
     return;
   });

   console.log("caiu no comeco");

   //Que comece o jogo
   src.itens.title = 'Jogo da velha';
   src.itens.desc = textGrade(src.grade);
   src.itens.footer.text = '';
   await src.dislike.remove();
   await src.like.remove();
   src.answ.edit({ embeds: [embedMess(src.itens)]});

   src.collector = chan.createMessageCollector({ filter: filter, time: inMili('00:06:40') });
   src.collector.on('collect', async m => {
     if (!src.players.includes(m.author.id)) return;

     if (m.author.id == src.first) {
       let sym = 'O';
     } else {
       let sym = 'X';
     };
     if (sym != rodadas(rodada)) return;

     let content = m.content.toLowerCase();
     let args = content.slice(prefix.length).trim().split(' ');
     let pos = args[0];

     if (!(0 < pos && pos < 10)) {
       m.delete();
       return;
     };

     src.grade[pos - 1] = rodadas[rodada];
     src.rodada++;
     src.itens.desc = textGrade(src.grade);
     await m.delete();
     src.answ.edit({ embeds: [embedMess(src.itens)]});
   });
};
