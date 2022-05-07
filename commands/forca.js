const { inMili, random } = require('../files/funcs');
const { MessageActionRow, MessageButton } = require('discord.js');
const { prefix } = require('../config.json');
const pList = require('../files/ultra.json');
var src;
var tela = [];
var forca = { palavras: {} };
const temas = ["Animal", "País", "Futebol", "Comida",
            "Natureza", "Objeto", "Roupa", "Bebida",
              "Veículo", "Fruta", "Nome", "Profissão",
        "Parte-do-corpo", "Lugar", "ind"
];
var palavras = pList.palavras.split(',');
const msgFilter = m => m.content.toLowerCase().startsWith(prefix);
const compFilter = i => true;

//Passa as palavras do "pList" para o objeto
//"palavras" no formato array
for(let i = 0; i < temas.length; i++){
  let tema = temas[i];
  forca.palavras[tema] = pList[tema].split(',');
};
const letras = [ "a","b","c","d","e","f","g","h",
                 "i","j","k","l","m","n","o","p",
                 "q","r","s","t","u","v","w","x",
                 "y","z"];

//-------------------FUNCOES----------------------

const setBut = () => {
  for (l of letras) {
    src.but[l] = new MessageButton({
      label: l.toUpperCase(),
      customId: l,
      //emoji: null,
      style: 'SECONDARY',
    });
  };
  src.but.more = new MessageButton({
    label: '...',
    customId: 'more',
    //emoji: "",
    style: 'SECONDARY',
  });
  src.but.back = new MessageButton({
    label: 'Voltar',
    customId: 'more',
    //emoji: "",
    style: 'SECONDARY',
  });
};

const colorIs = (chances) => {
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

const fim = (chanId) => {
  let src = forca[chanId];
  src.msgCollector.stop();
  src.iCollector.stop();
  forca[chanId] = undefined;
};

const gameOver = async (src) => {
  src.itens.color = colorIs(src.chances);
  src.itens.title = ':x: FIM DE JOGO!';
  src.itens.description = 'Acabaram as tentativas';
  src.itens.footer.text = ':(';
  src.answ.edit({ embeds: [ src.itens ], components: [] });
  //console.log('Acabou o timeout do canal ' + src.message.channelId);
  clearTimeout(src.death);
  fim(src.chanId)
};

const title = () => {
  return `FORCA | RESTAM ${src.chances} ERROS`;
};

const foram = (src) => {
  let array = [];
  for (let i = 0; i < src.tentativas.length; i++) {
    array.push(' ' + src.tentativas[i].toUpperCase());
  };
  return array;
};

const vitoria = async (src, author) => {
  src.itens.color = colorIs(5);
  src.itens.title = ':white_check_mark: PALAVRA DESCOBERTA!';
  src.itens.description = `:trophy: <@${author.id}> acertou a palavra!`;
  src.itens.footer.text = '';
  src.answ.edit({
    embeds: [ src.itens ], components: [] });
  clearTimeout(src.death);
  fim(src.chanId);
};

const upAcertos = () => {
  for (let i = 0; i < src.letrasNoRep.length; i++) {
    if (src.letrasNoRep[i] == src.palpite) {
      src.acertos[i] = src.palpite;
    };
  };
};

const segredo = () => {
  let segredo = '';
  for(l of src.letras) {
    if (src.acertos.includes(l)) {
      segredo = `${segredo}:regional_indicator_${l}: `;
    } else {
      segredo = `${segredo}:stop_button: `
    };
  };
  return segredo;
};

const themeIs = () => {
  for (let i = 0; i < temas.length; i++) {
    let este = forca.palavras[temas[i]].includes(src.palavra);
    if (este) {
      console.log('- Tema: ' + temas[i])
      src.tema = temas[i];
    };
  };
};

const createDeath = () => {
  //console.log(`Timeout definido para canal "${src.chan.name}"`);
  src.death = setTimeout(function() {
    src.itens.color = colorIs(0);
    src.itens.title = ':x: FIM DE JOGO!';
    src.itens.description = ':clock4: Acabou o tempo';
    src.itens.footer.text = '';
    src.answ.edit({ embeds: [ src.itens ]});
    //console.log(`Chegou ao fim o death do canal "${src.chan.name}"`);
    fim(src.chanId);
  }, inMili('00:06:40'));
};

const hasChances = async (src, m) => {
  //Ja que errou:
  //Se ainda houverem chances
  if (src.chances > 0) {
    src.chances--;
    src.jaErrou = true;
    src.itens.color = colorIs(src.chances);
    src.itens.title = title(src);
    src.itens.description = segredo(src);
    src.itens.footer.text = `${src.dica}`;
    src.answ.edit({ embeds: [ src.itens ] });
  } else {
    //Se acabarem as tentativas
    gameOver(src);
    return 0;
  };
};

const noAdv = (forca, chanId) => {
  if (!src.acertos.includes(false)) {
    //se acertarem todas as letras
    //sem adivinhar
    src.itens.color = colorIs(0);
    src.itens.title = ':x: FIM DE JOGO';
    src.itens.description = 'Ninguém adivinhou a palavra';
    src.itens.footer.text = ':(';
    src.answ.edit({ embeds: [ src.itens ] });
    fim(chanId);
  };
};

const upLines = async () => {
    abcde = new MessageActionRow({
      components: [ src.but.a, src.but.b, src.but.c, src.but.d, src.but.e ] });
    fghij = new MessageActionRow({
      components: [ src.but.f, src.but.g, src.but.h, src.but.i, src.but.j ] });
    klm = new MessageActionRow({
      components: [ src.but.k, src.but.l, src.but.m, src.but.more ] });
    nopqr = new MessageActionRow({
      components: [ src.but.n, src.but.o, src.but.p, src.but.q, src.but.r ] });
    stuvw = new MessageActionRow({
      components: [ src.but.s, src.but.t, src.but.u, src.but.v, src.but.w ] });
    xyz = new MessageActionRow({
      components: [ src.but.x, src.but.y, src.but.z, src.but.back ] });
};

//----------------------------------------------------

module.exports.run = async (message, args, chan) => {
  if (forca[chan.id]) {
    src = forca[chan.id];
  } else {
    forca[chan.id] = {};
    src = forca[chan.id];
  };
  if (src.ativo) return;

  src.ativo = true;
  src.dica = '';
  src.acertos = [];
  src.letras = [];
  src.chances = 5;
  src.tentativas = [];
  src.jaErrou = false;
  src.chan = chan;
  src.chanId = chan.id;
  src.tela = 0;
  src.but = {};
  src.letrasNoRep = [];
  //src.answ
  //src.palpite
  //src.palavra
  //src.itens
  //src.msgCollector

  setBut();
  upLines();

  //Escolhe a palavra
  src.palavra = palavras[random(palavras.length - 1)];
  console.log("- Palavra: " + src.palavra);

  //Descobre o tema
  themeIs();

  //Preenche src.letras com as letras da palavra
  //escolhida e preenche com falses o objeto
  //src.acertos
  src.letras = src.palavra.split('');
  for (l of src.letras) {
    if (!src.letrasNoRep.includes(l)) {
      src.letrasNoRep.push(l);
      src.acertos.push(false);
    };
  };
  console.log("- Letras: " + src.letras);
  console.log("- LetrasNoRep: " + src.letrasNoRep);
  //Informacoes para usar nas mensagens
  //enviadas
  src.itens = {
    color: colorIs(src.chances),
    title: title(src),
    description: `${segredo(src)}`,
    footer: {
      text: ``
    }
  };
  tela[0] = [ abcde, fghij, klm ];
  tela[1] = [ nopqr, stuvw, xyz ];
  createDeath();
  src.answ = await chan.send({
    embeds: [ src.itens ],
    components: tela[src.tela] });
  src.msgCollector = chan.createMessageCollector({ filter: msgFilter, idle: inMili('00:06:40')});
  //Oq vai acontecer com cada mensagem que for
  //enviada durante a forca
  src.msgCollector.on('collect', async m => {
    let content = m.content.toLowerCase();
    let args = content.slice(prefix.length).trim().split(' ');
    let chan = m.channel;
    let src = forca[chan.id];

    //Comandos de jogo ativo
    switch (args[0]) {
      case 'end':
        //Se for o comando end
        src.itens.color = '#c0c0c0';
        src.itens.title = 'JOGO FINALIZADO';
        src.itens.description = '';
        src.itens.footer.text = ``;
        src.answ.edit({ embeds: [ src.itens ],
          components: [] });
        clearTimeout(src.death);
        fim(chan.id);
        return;
      break;

      case 'dica':
        await m.delete();
        if (src.dica) return;
        if (src.tema == 'ind') {
          src.dica = 'Essa palavra não tem dica. ;-;';
        } else {
          src.dica = `Dica: ${src.tema.replace(/-/g,' ')}`;
        };
        src.itens.footer.text = `${src.dica}
${src.itens.footer.text.trim()}`;
        src.answ.edit({ embeds: [ src.itens ] });
        return;
      break;

      case 'up':
        await m.delete();
        try {
          src.answ.delete()
           .catch(console.error);
        } catch (err) {}
        src.answ = await chan.send({ embeds: [ src.itens ] });
        return;
    };

    src.palpite = args[0];

    if (src.palpite == 'forca') {
      await m.delete();
      return;
    };

    console.log(`-- Palpite: ${src.palpite}`)

    //Se tamanhos forem iguais
    if (src.palpite.length == src.palavra.length) {
      if (src.palpite == src.palavra) {
        await m.delete();
        vitoria(src, m.author);
      } else {
        hasChances(src, m);
      }; //fecha o else do if palpite = palavra
    }; //Fecha o if tamanhos iguais

    src.answ.edit({ embeds: [ src.itens ]});
  }); //Fecha o msgCollector

  src.iCollector = src.answ.createMessageComponentCollector({ filter: compFilter, idle: inMili('00:06:40') });
  src.iCollector.on("collect", async i => {
    let chan = i.channel;
    let src = forca[chan.id];
    let m = i.message;

    switch (i.customId) {
      case 'more':
        if (src.tela == 0) src.tela = 1
          else src.tela = 0;
        break;
      default:
        src.but[i.customId] = new MessageButton({
          label: i.customId.toUpperCase(),
          customId: i.customId,
          //emoji: null,
          style: 'SECONDARY',
          disabled: true
        });
        src.palpite = i.customId;
        if (src.tentativas.includes(src.palpite)) return;
          src.tentativas.push(src.palpite);
          upAcertos(src);
          src.itens.desc = segredo(src);
          //Se acertou
          if (src.acertos.includes(src.palpite)) {
            console.log("- Acertou!");
            src.tentativas.splice(-1, 1);
            let falses = 0;
            for (a of src.acertos) {
              if (!a) falses += 1;
            };
            console.log("- Faltam " + falses + " letras")
            if (falses == 2) {
              src.itens.color = colorIs(src.chances);
              src.itens.title = title(src);
              if (src.jaErrou) {
                src.itens.footer.text = `${src.dica}`;
              };
              src.itens.description = segredo(src);
              src.answ.edit({
                embeds: [ src.itens ],
                components: [] });
              return;
            };
            //se ainda tiverem letras nao descobertas
            src.itens.color = colorIs(src.chances);
            src.itens.title = title(src);
            if (src.jaErrou) {
              src.itens.footer.text = `${src.dica}`;
            };
            src.itens.description = segredo(src);
            //noAdv(forca, chan.id, m);
          } else {
            //Se errou
            console.log("- Errou");
            let end = await hasChances(src, m);
            if (end) return;
          }; //Fecha o else do if nao houver acerto
    };

    await upLines();

    tela[0] = [ abcde, fghij, klm ];
    tela[1] = [ nopqr, stuvw, xyz ];

    await src.answ.edit({
      embeds: [ src.itens ],
      components: tela[src.tela] });
  });

}; //fecha o modulo.exports
