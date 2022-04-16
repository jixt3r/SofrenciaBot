const { embedMess, inMili, random } = require('../files/funcs.js');
const config = require('../config.json');
const prefix = config.prefix;
const pList = require('../files/ultra.json');
var src = {};
var all = {};
all.temas = ["Animal", "País", "Futebol", "Comida",
            "Natureza", "Objeto", "Roupa", "Bebida",
              "Veículo", "Fruta", "Nome", "Profissão",
        "Parte-do-corpo", "Lugar", "ind"
];
all.palavras = pList.palavras.split(',');
all.starts = [prefix.toUpperCase(), prefix.toLowerCase()];
const filter = m => all.starts.includes(m.content.substr(0, prefix.length));

//Passa as informacoes do "pList" para o objeto
//"palavras" num formato util
for(let i = 0; i < all.temas.length; i++){
  let tema = all.temas[i];
  all.palavras[tema] = pList[tema].split(',');
};

//-------------------FUNCOES----------------------

isLetra = (char) => {
  if (!char) return;
  let letras = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  return letras.includes(char);
};

colorIs = (chances) => {
  let verde = '#00ffa2'; //#00a86b-Jade
  let amarelo = '#ffd700';
  let vermelho = '#ff2400';
  if (chances > 3) {
    return verde;
  } else if (chances > 1 && chances < 4) {
      return amarelo;
  } else if (chances < 2) {
      return vermelho;
  };
};

fim = (all, chanId) => {
  let src = all[chanId];
  src.collector.stop();
  all[chanId] = undefined;
  src.ativo = false;
};

gameOver = async (src) => {
  src.itens.color = colorIs(src.chances);
  src.itens.title = ':x: FIM DE JOGO!';
  src.itens.desc = 'Acabaram as tentativas';
  src.itens.footer.text = ':(';
  try {
    await src.msgdica.delete()
  } catch (err) {}
  src.answ.edit({ embeds: [embedMess(src.itens)] });
  //console.log('Acabou o timeout do canal ' + src.message.channelId);
  clearTimeout(src.death);
  src.death = undefined;
  fim(all, src.chanId)
};

foram = (src) => {
  let array = [];
  for (let i = 0; i < src.tentativas.length; i++) {
    array.push(' ' + src.tentativas[i].toUpperCase());
  };
  return array;
};

vitoria = async (src, author) => {
  src.itens.color = colorIs(5);
  src.itens.title = ':white_check_mark: PALAVRA DESCOBERTA!';
  src.itens.desc = `:trophy: <@${author.id}> acertou a palavra!`;
  src.itens.footer.text = '';
  try {
    await src.msgdica.delete()
  } catch (err) {}
  src.answ.edit({ embeds: [embedMess(src.itens)] });
  clearTimeout(src.death);
  fim(all, src.chanId);
};

upAcertos = (src) => {
  for (let i = 0; i < src.letras.length; i++) {
    if (src.letras[i] == src.palpite) {
      src.acertos[i] = src.palpite;
    };
  };
};

segredo = (src) => {
  let segredo = '';
  for(let i = 0; i < src.palavra.length; i++) {
    if (src.acertos[i]) {
      segredo = `${segredo}:regional_indicator_${src.acertos[i].toLowerCase()}: `;
    } else {
      segredo = `${segredo}:stop_button: `
    };
  };
  return segredo;
};

themeIs = (all, src) => {
  let temas = all.temas;
  for (let i = 0; i < temas.length; i++) {
    let este = all.palavras[temas[i]].includes(src.palavra);
    if (este) {
      console.log('- Tema: ' + temas[i])
      src.tema = temas[i];
    };
  };
};

createDeath = (src) => {
  //console.log(`Timeout definido para canal "${src.chan.name}"`);
  src.death = setTimeout(function(src) {
    src.itens.color = colorIs(0);
    src.itens.title = ':x: FIM DE JOGO!';
    src.itens.desc = ':clock4: Acabou o tempo';
    src.itens.footer.text = '';
    src.answ.edit({ embeds: [embedMess(src.itens)]});
    //console.log(`Chegou ao fim o death do canal "${src.chan.name}"`);
    fim(all, src.chanId);
  }, inMili('00:06:40'), src);
};

hasChances = async(src, m) => {
  //Ja que errou:
  //Se ainda houverem chances
  if (src.chances > 0) {
    src.chances--;
    src.jaErrou = true;
    src.itens.color = colorIs(src.chances);
    src.itens.title = 'RESTAM ' + src.chances + ' ERROS';
    src.itens.desc = segredo(src);
    src.itens.footer.text = 'Já foram: ' + foram(src);
    await m.delete()
     .catch(console.error);
    src.answ.edit({ embeds: [embedMess(src.itens)] });
  } else {
    //Se acabarem as tentativas
    await m.delete()
     .catch(console.error);
    gameOver(src);
    return;
  };
};

noAdv = (all, chanId) => {
  if (!src.acertos.includes(false)) {
    //se acertarem todas as letras
    //sem adivinhar
    src.itens.color = colorIs(0);
    src.itens.title = ':x: FIM DE JOGO';
    src.itens.desc = 'Ninguém adivinhou a palavra';
    src.itens.footer.text = ':(';
    src.answ.edit({ embeds: [embedMess(src.itens)] });
    fim(all, chanId);
  } else {
    //se ainda tiverem letras nao descobertas
    src.itens.color = colorIs(src.chances);
    src.itens.title = 'RESTAM ' + src.chances + ' ERROS';
    if (src.jaErrou) {
      src.itens.footer.text = 'Já foram: ' + foram(src);
    };
    src.itens.desc = segredo(src);
  };
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

  src.ativo = true;
  src.acertos = [];
  src.letras = [];
  src.chances = 5;
  src.tentativas = [];
  src.jaErrou = false;
  src.chan = chan;
  src.chanId = chan.id;
  //src.answ
  //src.palpite
  //src.msgdica
  //src.palavra
  //src.itens
  //src.collector

  //Escolhe a palavra
  src.palavra = all.palavras[random(all.palavras.length - 1)];
  console.log("- Palavra: " + src.palavra);

  //Descobre o tema
  themeIs(all, src);

  //Preenche src.letras com as letras da palavra
  //escolhida e preenche com falses o objeto
  //src.acertos
  for (let i = 0; i < src.palavra.length; i++) {
    src.letras.push(src.palavra[i]);
    src.acertos[i] = false;
  };

  //Informacoes para usar nas mensagens
  //enviadas
  src.itens = {
    color: colorIs(src.chances),
    title: `RESTAM ${src.chances} ERROS`,
    desc: segredo(src),
    footer: {
      text: ''
    }
  };
  createDeath(src);
  src.answ = await chan.send({ embeds: [embedMess(src.itens)] });
  src.collector = chan.createMessageCollector({ filter, time: inMili('00:06:40')});
  //Oq vai acontecer com cada mensagem que for
  //enviada durante a forca
  src.collector.on('collect', async m => {
    let content = m.content.toLowerCase();
    let args = content.slice(prefix.length).trim().split(' ');
    let chan = m.channel;
    let src = all[chan.id];

    //Comandos de jogo ativo
    switch (args[0]) {
      case 'end':
        //Se for o comando end
        src.itens.color = '#c0c0c0';
        src.itens.title = 'JOGO FINALIZADO';
        src.itens.desc = '';
        src.itens.footer.text = '';
        try {
          await src.msgdica.delete()
           .catch(console.error);
        } catch (err) {}
        src.answ.edit({ embeds: [embedMess(src.itens)]});
        clearTimeout(src.death);
        fim(all, chan.id);
        return;
      break;

      case 'dica':
        await m.delete();
        try {
          await src.msgdica.delete()
           .catch(console.error);
        } catch (err) {}
        if (src.tema == 'ind') {
          src.msgdica = await chan.send({ embeds: [{color: colorIs(src.chances), description: '**Essa palavra não tem dica.**' }]});
        } else {
          src.msgdica = await chan.send({ embeds: [{color: colorIs(src.chances), description: `**Dica: ${src.tema.replace(/-/g,' ')}**`}]});
        };
        return;
      break;

      case 'up':
        await m.delete();
        try {
          await src.answ.delete()
           .catch(console.error);
        } catch (err) {}
        src.answ = await chan.send({ embeds: [embedMess(src.itens)] });
        return;
    };

    src.palpite = args[0];

    if (src.palpite == 'forca') {
      await m.delete()
       .catch(console.error);
      return;
    };

    console.log(`-- Palpite: ${src.palpite}`)

    //Se palpite for uma letra
    if (isLetra(src.palpite)) {
      console.log('- Letra recebida')
      //Se palpite ainda nao foi usado
      if (!src.tentativas.includes(src.palpite)) {
        src.tentativas.push(src.palpite);
        upAcertos(src);
        src.itens.desc = segredo(src);
        console.log('- Palpite novo');
        //Se acertou
        if (src.acertos.includes(src.palpite)) {
          console.log("- Acertou!");
          src.tentativas.splice(-1, 1);
          await m.delete()
           .catch(console.error);
          noAdv(all, chan.id, m);
        } else {
          //Se errou
          console.log("- Errou");
          hasChances(src, m);
        }; //Fecha o else do if nao houver acerto
      } else {
        //se o palpite ja foi usado
        console.log('- Letra repetida');
        await m.delete()
         .catch(err => console.error("erro7: " + err));
        return;
      }; //fecha o else do if palpite nao foi usado
    }; //Fecha o if palpite isLetra

    //Se tamanhos forem iguais
    if (src.palpite.length == src.palavra.length) {
      if (src.palpite == src.palavra) {
        await m.delete();
        vitoria(src, m.author);
      } else {
        //Houve erro entao:
        //Se restam chances
        if (src.chances > 0) {
          src.chances--;
          upSegredo(src);
          src.itens.color = colorIs(src.chances);
          src.itens.title = 'RESTAM ' + src.chances + ' ERROS';
          src.itens.desc = segredo(src);
          src.itens.footer.text = 'Já foram: ' + foram(src);
          await m.delete()
           .catch(console.log("-- err 3400"));
          src.answ.edit({ embeds: [embedMess(src.itens)] });
        } else {
          //se acabarem as chances
          await m.delete()
           .catch(console.error);
          gameOver(src);
          return;
        };
      }; //fecha o else do if palpite = palavra
    }; //Fecha o if tamanhos iguais
    src.answ.edit({ embeds: [embedMess(src.itens)]});
  }); //Fecha o collector
}; //fecha o modulo.exports
