
//-------------------Variaveis--------------------
const { prefix } = require('../config.json');
const { MessageActionRow, MessageButton } = require('discord.js');
const { inMili } = require('../files/funcs.js');
const rodadas = ["O", "X", "O", "X", "O", "X", "O", "X", "O"];
const emojis = ['1️⃣', '2️⃣', '3️⃣',
                '4️⃣', '5️⃣', '6️⃣',
                '7️⃣', '8️⃣', '9️⃣'
];
var all = {};

//--------------------Funcoes---------------------

compFilter = interaction => {
  return interaction.user.id == src.invitedId;
};

filter = (m) => {
  let IDs = [src.players[0].id, src.players[1].id]
  return IDs.includes(m.author.id) && m.content.toLowerCase().startsWith(prefix);
};

textGrade = (grade) => {
  let text = '';
  for(let i = 0; i < 9; i++) {
    if (grade[i] == 'X') {
      text += ':regional_indicator_x: ';
    } else if (grade[i] == 'O') {
      text += ':regional_indicator_o: ';
    } else {
       text += emojis[i] + ` `;
    };
    if (i == 2 || i == 5) {
      text += '\n';
    };
  };
  return text;
};

venceu = (grade) => {
  for (let l = 0; l < 7; l += 3) {
    if (grade[l] != '!' && grade[l] == grade[l + 1] && grade[l + 1] == grade[l + 2]) {
      return grade[l];
    };
  }; //Confere vitorias horizontais

  for (let c = 0; c < 3; c++) {
    if (grade[c] != '!' && grade[c] == grade[c + 3] && grade[c + 3] == grade[c + 6]) {
      return grade[c];
    };
  }; //Confere vitorias verticais

  //Confere vitorias diagonais
  if (grade[0] != '!' && grade[0] == grade[4] && grade[4] == grade[8]) {
    return grade[0];
  };
  if (grade[2] != '!' && grade[2] == grade[4] && grade[4] == grade[6]) {
    return grade[2];
  };
  return false;

//Combinacoes de vitorias
//012 147 852
//036 345 876
//048 246
};

end = (chan) => {
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

  let guildMembers = chan.guild.members;
  src.invited = args[1];
  if (!src.invited) {
    message.reply('Falta um usuário para jogar junto');
    return;
  } else if (!src.invited.startsWith('<@') || !src.invited[src.invited.length - 1] == '>' || !src.invited.length == 21 || isNaN(src.invited.slice(2, 20)) ) {
    message.reply("Usuário indisponível")
    return;
  };

  if (!guildMembers.resolve(src.invited.slice(2, 20))) {
    message.reply("Usuário indisponível")
    return;
  };

  start = (chan) => {
    let src = all[chan.id]
    src.itens.title = 'JOGO DA VELHA';
    src.itens.description = textGrade(src.grade);
    src.itens.footer.text = '';
    src.answ.edit({ embeds: [ src.itens ] });

    src.collector = chan.createMessageCollector({ filter: filter, time: inMili('00:06:40') });
    src.collector.on('collect', async m => {
      //console.log("\n- Mensagem coletada");
      let chan = m.channel;
      let src = all[chan.id];
      let content = m.content.toLowerCase();
      let args = content.slice(prefix.length).trim().split(' ');

      switch (args[0]) {
        case 'end':
          src.collector.stop();
          src.itens.title = 'JOGO DA VELHA';
          src.itens.footer.text = 'Jogo encerrado!';
          src.answ.edit({ embeds: [ src.itens ]});
          end(chan);
        break;
      };
      if (src.turn == 0) {
        src.turn = 1;
      } else {
        src.turn = 0;
      };
      if (!src.turn) {
        src.turn = 0;
      };
      let turnOf = src.players[src.turn];
      if (m.author.id != turnOf.id) return;
      //console.log("\n- TurnOf: " + turnOf.username);

      let pos = args[0];
      //console.log("\n- Rodada: " + src.rodada);
      //console.log("- Pos: " + pos);
      if (!(0 < pos && pos < 10) || isNaN(pos)) {
        await m.delete();
        return;
      };
      if (src.grade[pos - 1] == '!') {
        src.grade[pos - 1] = rodadas[src.rodada];
      } else {
        await m.delete();
        return;
      };
      src.sum += pos - 1;
      //console.log("- Rodada++")
      src.rodada++;
      if (src.rodada == 8) {
        console.log(36 - src.sum);
        src.grade[36 - src.sum] = 'O';
        src.collector.stop();
      };
      src.itens.description = textGrade(src.grade);
      await m.delete();
      src.answ.edit({ embeds: [ src.itens ]});
      let vitoria = venceu(src.grade);
      if (vitoria) {
        if (vitoria == 'O') {
          var champ = src.players[0].username;
        } else {
          var champ = src.players[1].username;
        };
        src.collector.stop();
        src.itens.title = 'JOGO DA VELHA';
        if (!src.autoplay) {
          src.itens.footer.text = `${champ} venceu a partida`;
        } else {
          src.itens.footer.text = 'E agora? Você venceu ou perdeu?';
        };
        src.answ.edit({ embeds: [ src.itens ]});
        end(chan);
      } else if (src.rodada == 8) {
        src.collector.stop();
        src.itens.title = 'JOGO DA VELHA';
        src.itens.footer.text = 'Deu velha! :/';
        src.answ.edit({ embeds: [ src.itens ]});
        end(chan);
      };
    }); //Fecha o collector.on
    src.death = setTimeout((src, chan) => {
      src.itens.footer.text = 'Tempo esgotado!';
      src.answ.edit({ embeds: [ src.itens ] });
      end(chan);
    }, inMili('00:06:40'), src, chan);
  };

  src.grade = ['!', '!', '!', // 0 1 2
               '!', '!', '!', // 3 4 5
               '!', '!', '!'  // 6 7 8
  ];
  src.itens = {
    color: '#c0c0c0',
    title: 'JOGO DA VELHA',
    description: '',
    footer: {
      text: ''
    }
  };
  src.ativo = true;
  src.rodada = 0;
  src.sum = 0;
  src.close = false;
  src.userId = message.author.id;
  src.invitedId = src.invited.slice(2, 20);
  if (src.userId == src.invitedId) src.autoplay = true;
  src.players = [];
  await guildMembers.fetch({ user: [ src.userId, src.invitedId ] })
   .then(collected => {
     src.players.push(collected.get(src.userId).user);
     src.players.push(collected.get(src.invitedId).user);
   })
   .catch(console.error);
  //console.log(src.players[0].username);
  //console.log(src.players[1].username);

  if (!src.autoplay) {
    accept = new MessageButton({
      //label: '',
      customId: 'sim',
      emoji: '👍',
      style: 'SECONDARY',
    });

    reject = new MessageButton({
      //label: '',
      customId: 'não',
      emoji: '👎',
      style: 'SECONDARY',
    });

    actRow = new MessageActionRow({
      components: [ accept, reject  ]
    });

    //Prepara a mensagem do convite
    src.itens.description = `${src.invited}, <@${src.userId}> quer jogar jogo da velha com você.
Use 👍 para aceitar, ou 👎 para recusar.`;
    src.answ = await chan.send({
      embeds: [ src.itens ],
      components: [ actRow ]
    });

    await src.answ.awaitMessageComponent({ filter: compFilter, time: 60_000 })
     .then(async interaction => {
       console.log("\n- Interação detectada!");
       //console.log(interaction);
       switch (interaction.customId) {
         case 'não':
           src.itens.title = 'Convite recusado!';
           src.itens.description = `${src.invited} não quer jogar.`;
           src.itens.footer.text = ':(';
           src.answ.edit({ embeds: [ src.itens ], components: [] });
           src.close = true;
         break;
       };
     })
     .catch(err => {
       console.error(err);
       src.itens.title = 'Que demora!';
       src.itens.description = 'O jogo foi cancelado!';
       src.itens.footer.text = '(×_×)';
       src.answ.edit({ embeds: [ src.itens ],
         components: [] });
       end(chan);
       src.close = true;
     });
  }; //Fecha o if !autoplay
   if (src.close) {
     end(chan);
     return;
   };

   console.log("\n- Que comece o jogo");

   src.itens.title = 'JOGO DA VELHA';
   if (!src.autoplay) {
     src.itens.description = `<@${src.userId}> e ${src.invited}, o jogo começará em 10 segundos.`;
   } else {
     src.itens.description = 'O jogo começará em 10 segundos.';
   };
   src.itens.footer.text = '';
   if (!src.autoplay) {
     src.answ.edit({ embeds: [ src.itens ],
       components: [] });
   } else {
     src.answ = await chan.send({ embeds: [ src.itens ] });
   };

   setTimeout( start, 10_000, chan);
};
