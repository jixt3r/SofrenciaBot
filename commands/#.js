
//-------------------Variaveis--------------------
var cog;
const { embedMess, remoji } = require('../files/funcs.js');
const emojis = ['↖️', '⬆️', '↗️',
                '⬅️', '⏺️', '➡️',
                '↙️', '⬇️', '↘️']
var grade = [
  '!', '!', '!', // 0 1 2
  '!', '!', '!', // 3 4 5
  '!', '!', '!'  // 6 7 8
];
var itens = {
  color: '#c0c0c0',
  title: 'Jogo da velha',
  desc: `${user} desafia ${invited} para um jogo da velha.\n
        ${invited}, reaja com 👍 para aceitar ou 👎 para recusar o desafio.`,
  footer: {
    text: ''
  //iconUrl: ''
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
      vitoria();
    };
  }; //Confere vitorias horizontais

  for (let c = 0; c < 3; c++) {
    if (grade[c] == grade[c + 3] && grade[c + 3] == grade[c + 6]) {
      vitoria();
    };
  }; //Confere vitorias verticais

  //Confere vitorias verticais
  if (grade[0] == grade[4] && grade[4] == grade[8]) {
    vitoria();
  };
  if (grade[2] == grade[4] && grade[4] == grade[6]) {
    vitoria();
  };

//Combinacoes de vitorias
//012 147 852
//036 345 876
//048 246
};

end = () => {
  
};

//------------------------------------------------

module.exports.run = async (all) => {
  //Simplifica variaveis
  client = all.client;
  message = all.message;
  channel = message.channel;
  args = all.args;

  itens.desc = upGrade(grade);
  invited = {
    id: args[1]
  };

  //Prepara a mensagem do jogo
  answ = await channel.send({ embeds: [embedMess(itens)]});
  await answ.react("👍");
  await answ.react("👎");

  var filter = (reaction, user) => {
    return reaction.name === "👍" && user.id == invited.id;
  };

  const collector = answ.createReactionCollector({ filter, time: 7 * 1000 });

  collector.on('collect', (reaction, user) => {
    
  });

  collector.on('end', collected => {
    itens.title = 'Que demora!';
    itens.desc = 'O desafio foi cancelado!';
    itens.footer.text = '(×_×)';
    answ.edit({ embeds: [embedMess(itens)]});
    end();
  });

  //remoji(answ, '😎', botId);
};
