
//-------------------Variaveis--------------------
const { prefix } = require('../config.json');
const { MessageActionRow, MessageButton } = require('discord.js');
const { inMili } = require('../files/funcs.js');
const rodadas = ["O", "X", "O", "X", "O", "X", "O", "X", "O"];
const emojis = ['1️⃣', '2️⃣', '3️⃣',
                '4️⃣', '5️⃣', '6️⃣',
                '7️⃣', '8️⃣', '9️⃣'
];
var velha = {};

//--------------------Funcoes---------------------

compFilter = interaction => {
  return interaction.user.id == veia.invitedId;
};

filter = (m) => {
  let IDs = [veia.players[0].id, veia.players[1].id]
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
  velha[chan.id] = undefined;
};

//------------------------------------------------

module.exports.run = async (message, args, chan) => {
  if (velha[chan.id]) {
    veia = velha[chan.id];
  } else {
    velha[chan.id] = {};
    veia = velha[chan.id];
  };
  if (veia.ativo) return;

  let guildMembers = chan.guild.members;
  veia.invited = args[1];
  if (!veia.invited) {
    message.reply('Falta um usuário para jogar junto');
    return;
  } else if (!veia.invited.startsWith('<@') || !veia.invited[veia.invited.length - 1] == '>' || !veia.invited.length == 21 || isNaN(veia.invited.slice(2, 20)) ) {
    message.reply("Usuário indisponível")
    return;
  };

  if (!guildMembers.resolve(veia.invited.slice(2, 20))) {
    message.reply("Usuário indisponível")
    return;
  };

  start = (chan) => {
    let veia = velha[chan.id];
    veia.itens.title = 'JOGO DA VELHA';
    veia.itens.description = textGrade(veia.grade);
    veia.itens.footer.text = '';
    veia.answ.edit({ embeds: [ veia.itens ] });

    veia.collector = chan.createMessageCollector({ filter: filter, time: inMili('00:06:40') });
    veia.collector.on('collect', async m => {
      //console.log("\n- Mensagem coletada");
      let chan = m.channel;
      let veia = velha[chan.id];
      let content = m.content.toLowerCase();
      let args = content.slice(prefix.length).trim().split(' ');

      switch (args[0]) {
        case 'end':
          veia.collector.stop();
          veia.itens.title = 'JOGO DA VELHA';
          veia.itens.footer.text = 'Jogo encerrado!';
          veia.answ.edit({ embeds: [ veia.itens ]});
          end(chan);
        break;
      };
      if (veia.turn == 0) {
        veia.turn = 1;
      } else {
        veia.turn = 0;
      };
      if (!veia.turn) {
        veia.turn = 0;
      };
      let turnOf = veia.players[veia.turn];
      if (m.author.id != turnOf.id) return;
      //console.log("\n- TurnOf: " + turnOf.username);

      let pos = args[0];
      //console.log("\n- Rodada: " + veia.rodada);
      //console.log("- Pos: " + pos);
      if (!(0 < pos && pos < 10) || isNaN(pos)) {
        await m.delete();
        return;
      };
      if (veia.grade[pos - 1] == '!') {
        veia.grade[pos - 1] = rodadas[veia.rodada];
      } else {
        await m.delete();
        return;
      };
      veia.sum += pos - 1;
      //console.log("- Rodada++")
      veia.rodada++;
      if (veia.rodada == 8) {
        console.log(36 - veia.sum);
        veia.grade[36 - veia.sum] = 'O';
        veia.collector.stop();
      };
      veia.itens.description = textGrade(veia.grade);
      await m.delete();
      veia.answ.edit({ embeds: [ veia.itens ]});
      let vitoria = venceu(veia.grade);
      if (vitoria) {
        if (vitoria == 'O') {
          var champ = veia.players[0].username;
        } else {
          var champ = veia.players[1].username;
        };
        veia.collector.stop();
        veia.itens.title = 'JOGO DA VELHA';
        if (!veia.autoplay) {
          veia.itens.footer.text = `${champ} venceu a partida`;
        } else {
          veia.itens.footer.text = 'E agora? Você venceu ou perdeu?';
        };
        veia.answ.edit({ embeds: [ veia.itens ]});
        end(chan);
      } else if (veia.rodada == 8) {
        veia.collector.stop();
        veia.itens.title = 'JOGO DA VELHA';
        veia.itens.footer.text = 'Deu velha! :/';
        veia.answ.edit({ embeds: [ veia.itens ]});
        end(chan);
      };
    }); //Fecha o collector.on
    veia.death = setTimeout((veia, chan) => {
      veia.itens.footer.text = 'Tempo esgotado!';
      veia.answ.edit({ embeds: [ veia.itens ] });
      end(chan);
    }, inMili('00:06:40'), veia, chan);
  };

  veia.grade = ['!', '!', '!', // 0 1 2
               '!', '!', '!', // 3 4 5
               '!', '!', '!'  // 6 7 8
  ];
  veia.itens = {
    color: '#c0c0c0',
    title: 'JOGO DA VELHA',
    description: '',
    footer: {
      text: ''
    }
  };
  veia.ativo = true;
  veia.rodada = 0;
  veia.sum = 0;
  veia.close = false;
  veia.userId = message.author.id;
  veia.invitedId = veia.invited.slice(2, 20);
  if (veia.userId == veia.invitedId) veia.autoplay = true;
  veia.players = [];
  await guildMembers.fetch({ user: [ veia.userId, veia.invitedId ] })
   .then(collected => {
     veia.players.push(collected.get(veia.userId).user);
     veia.players.push(collected.get(veia.invitedId).user);
   })
   .catch(console.error);

  if (!veia.autoplay) {
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
    veia.itens.description = `${veia.invited}, <@${veia.userId}> quer jogar jogo da velha com você.
Use 👍 para aceitar, ou 👎 para recusar.`;
    veia.answ = await chan.send({
      embeds: [ veia.itens ],
      components: [ actRow ]
    });

    await veia.answ.awaitMessageComponent({ filter: compFilter, time: 60_000 })
     .then(async interaction => {
       console.log("\n- Interação detectada!");
       //console.log(interaction);
       switch (interaction.customId) {
         case 'não':
           veia.itens.title = 'Convite recusado!';
           veia.itens.description = `${veia.invited} não quer jogar.`;
           veia.itens.footer.text = ':(';
           veia.answ.edit({ embeds: [ veia.itens ], components: [] });
           veia.close = true;
         break;
       };
     })
     .catch(err => {
       console.error(err);
       veia.itens.title = 'Que demora!';
       veia.itens.description = 'O jogo foi cancelado!';
       veia.itens.footer.text = '(×_×)';
       veia.answ.edit({ embeds: [ veia.itens ],
         components: [] });
       end(chan);
       veia.close = true;
     });
  }; //Fecha o if !autoplay
   if (veia.close) {
     end(chan);
     return;
   };

   console.log("\n- Que comece o jogo!");

   veia.itens.title = 'JOGO DA VELHA';
   if (!veia.autoplay) {
     veia.itens.description = `<@${veia.userId}> e ${veia.invited}, o jogo começará em 10 segundos.`;
   } else {
     veia.itens.description = 'O jogo começará em 10 segundos.';
   };
   veia.itens.footer.text = '';
   if (!veia.autoplay) {
     veia.answ.edit({ embeds: [ veia.itens ],
       components: [] });
   } else {
     veia.answ = await chan.send({ embeds: [ veia.itens ] });
   };

   setTimeout( start, 10_000, chan);
};
