const { embedMess, random } = require('../files/funcs.js');
const config = require('../config.json');
const pList = require('../files/ultra.json');
const temas = ["Animal", "País", "Futebol", "Comida",
        "Natureza", "Objeto", "Roupa", "Bebida",
       "Veículo", "Fruta", "Nome", "Profissão",
         "Parte-do-corpo", "Lugar", "ind"];
var ativo;
var args;
var message;
var dados = {
  deaths: []
};
var src;
var palavras = pList.palavras.split(',');

//Passa as informacoes do "pList" para o objeto
//"palavras" num formato util
for(let i = 0; i < temas.length; i++){
  let tema = temas[i];
  //console.log(tema);
  palavras[tema] = pList[tema].split(',');
  //console.log('finou');
}

//-------------------FUNCOES----------------------

isLetra = (char) => {
  if (char == undefined) return;
  let letras = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  if (letras.indexOf(char.toLowerCase()) != -1) {
    return true;
  } else {
      return false;
  }
}

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
}

reset = (all, dados) => {
  all.ativos[all.message.channelId] = undefined;
  dados[all.message.channelId] = undefined;
}

gameOver = (src, all) => {
  src.itens.color = colorIs(src.chances);
  src.itens.title = ':x: FIM DE JOGO!';
  src.itens.desc = 'Acabaram as tentativas';
  src.itens.footer.text = ':(';
  try {
    src.msgdica.delete()
  } catch (err) {}
  src.answ.edit({ embeds: [embedMess(src.itens)] });
//  console.log('Acabou o timeout do canal ' + src.message.channelId);
  clearTimeout(dados.deaths[message.channelId]);
  //all.dados.deaths.shift();
  reset(all, dados);
}

foram = (src) => {
  let array = [];
  for (let i = 0; i < src.tentativas.length; i++) {
    array.push(' ' + src.tentativas[i].toUpperCase());
  }
  return array;
}

vitoria = (src, all) => {
  src.itens.color = colorIs(5);
  src.itens.title = ':white_check_mark: PALAVRA DESCOBERTA!';
  src.itens.desc = '​:trophy: <@' + src.message.author.id + '> acertou a palavra!';
  src.itens.footer.text = '';
  src.answ.delete()
    .catch(console.error);
  src.message.channel.send({ embeds: [embedMess(src.itens)] });
  all.ativos[src.message.channelId] = undefined;
  try {
    src.msgdica.delete()
  } catch (err) {}
//  console.log('Acabou o timeout do canal ' + src.message.channelId)
  clearTimeout(dados.deaths[message.channelId]);
  //all.dados.deaths.shift();
  reset(all, dados);
}

upAcertos = (src) => {
  for (let i = 0; i < src.letras.length; i++) {
    if (src.letras[i] == src.palpite) {
      src.acertos[i] = src.palpite;
    }
  }
}

upSegredo = (src) => {
  src.segredo = '';
  for(let i = 0; i < src.palavra.length; i++) {
    if (src.acertos[i] != '0') {
      src.segredo = src.segredo + ':regional_indicator_' + src.acertos[i].toLowerCase() + ': '
    } else {
      src.segredo = src.segredo + ':stop_button: '
    }
  }
}

//------------------------------------------------

module.exports.run = async (all) => {
  //Simplifica variaveis
  args = all.args;
  message = all.message;
  ativo = all.ativo;

  //Se nao estiver ativo
  if (ativo == false) {
    //Abre o espaco para informacoes do jogo
    //do canal
    all.ativos[message.channelId] = {};
    all.ativos[message.channelId].servico = 'forca';

    //Cria o objeto "dados" para guardar
    //informacoes do jogo
    dados[message.channelId] = {
      acertos: [],
      letras: [],
      //segredo: '',
      //answ: '',
      //palpite: '',
      //palavra: '',
      itens: {},
      chances: 5,
      tentativas: [],
      jaErrou: false
    }


    //Simplifica variaveis
    src = dados[message.channelId];
    src.message = message;
    all.dados = dados;

    //escolhe a palavra
    src.palavra = palavras[random(palavras.length - 1)]

    //Descobre qual o tema da palavra escolhida
    for (let i = 0; i < temas.length; i++) {
      let tema = palavras[temas[i]].find(p => p == src.palavra);
      if (tema != undefined) {
        //console.log('O tema é: ' + temas[i])
        src.tema = temas[i];
      }
    }

    //Preenche "src.letras" com as letras da
    //palavra escolhida e preenche com zeros
    //o objeto "src.acertos"
    for (let i = 0; i < src.palavra.length; i++) {
      src.letras.push(src.palavra[i]);
      src.acertos[i] = '0';
    }

    upSegredo(src);
    console.log('- Palavra: ' + src.palavra);

    //Informacoes para usar nas mensagens
    //enviadas
    src.itens = {
      color: colorIs(src.chances),
      //author: {
      //  name: 'SofrenciaBot',
      //  url: '',
      //  iconUrl: ''
      //  proxyIconUrl: ''
      //},
      url: '',
      title: 'RESTAM ' + src.chances + ' ERROS',
      //thumb: {
      //  url: '',
      //  proxyURL: 'none',
      //  height: 0,
      //  width: 0
      //},
      desc: src.segredo,
      //fields: [{
      //  name: 'Testando',
      //  value: 'k\r\nj',
      //  inline: false
      //}],
      //image: ,
      //video: {
      //  url: ,
      //  proxyURL: ,
      //  height: ,
      //  width:
      //},
      footer: {
        text: ''
      //iconUrl: ''
      //proxyIconUrl: ''
      }
    };

//    console.log('Timeout definido para ' + src.message.channelId);
    dados.deaths[message.channelId] = setTimeout(function(mess, sr) {
      sr.itens.color = colorIs(0);
      sr.itens.title = ':x: FIM DE JOGO!';
      sr.itens.desc = ':clock4: Acabou o tempo';
      sr.itens.footer.text = '';
      sr.answ.edit({ embeds: [embedMess(sr.itens)]});
//      console.log('Chegou ao fim o death do canal ' + sr.message.channelId);
      all.ativos[mess.channelId] = undefined;
      dados[mess.channelId] = undefined;
      dados.deaths.shift();
    }, 6 * 60000 + 40 * 1000, message, src)

    src.answ = await message.channel.send({ embeds: [embedMess(src.itens)] });
  } else {
      //se ja estiver ativo

      //Simplifica variaveis
      src = dados[message.channelId];
      src.message = message;

      //Comandos de jogo ativo
      switch (args[0].toLowerCase().slice(config.prefix.length)) {
        case 'end':
          //Se for o comando end
          src.itens.color = '#c0c0c0';
          src.itens.title = 'JOGO FINALIZADO';
          src.itens.desc = '';
          src.itens.footer.text = '';
          try {
            src.msgdica.delete()
          } catch (err) {}
          //message.delete()
          src.answ.edit({ embeds: [embedMess(src.itens)]});
//          console.log('Desfez o Death do ' + src.message.channelId)
//          console.log(dados.deaths[0])
          clearTimeout(dados.deaths[message.channelId]);
//          all.dados.deaths.shift();
          reset(all, dados);
          return;
          break;

        case 'dica':
          ///console.log('- O jogador quer dica.');
          message.delete()
            .catch(console.error);
          try {
            src.msgdica.delete()
          } catch (err) {}
          if (src.tema == 'ind') {
            src.msgdica = await message.channel.send({ embeds: [{color: colorIs(src.chances), description: 'Esta palavra não tem dica'}]});
          } else {
              src.msgdica = await message.channel.send({ embeds: [{color: colorIs(src.chances), description: `**Dica: ${src.tema.replace(/-/g,' ')}**`}]});
          }
          return;

        case 'up':
          src.answ.delete()
            .catch(console.error);
          src.answ = await message.channel.send({ embeds: [embedMess(src.itens)] });
          return;
      }

      //Se nao usar um subcomando

      //Define o palpite
      src.palpite = args[0].slice(config.prefix.length);

      //Se tamanho do palpite for diferente
      //do tamanho da palavra
      if (src.palpite.length != src.palavra.length) {

        //Se a inicial do palpite for uma letra
        if (isLetra(src.palpite[0])) {

          //Define o palpite letra
          src.palpite = src.palpite[0].toLowerCase();

          //se palpite ainda nao foi usado
          if (src.tentativas.find( l => l == src.palpite) == undefined) {

            //Coloca o palpite na lista de
            //tentativas que ja foram
            src.tentativas.push(src.palpite);

            upAcertos(src);
            upSegredo(src);

            //se nao houve acerto
            if (src.acertos.find(e => e == src.palpite) == undefined) {

              //Se ainda houverem chances
              //de erros
              if (src.chances > 0) {
                src.chances--;
                src.jaErrou = true;
                upSegredo(src);
                src.itens.color = colorIs(src.chances);
                src.itens.title = 'RESTAM ' + src.chances + ' ERROS';
                src.itens.desc = src.segredo;
                if (src.jaErrou == true) {
                  src.itens.footer.text = 'Já foram: ' + foram(src);
                }
                message.delete()
                  .catch(console.error);
                src.answ.edit({ embeds: [embedMess(src.itens)] });
              } else {
                  //se acabarem as tentativas
                  message.delete()
                    .catch(console.error);
                  gameOver(src, all);
                  return;
              }
            } else {
                //Se houver acerto
                src.tentativas.splice(src.tentativas.length - 1, 1);
                message.delete()
                  .catch(console.error);
                if (src.acertos.find(u => u == '0') == undefined) {
                //se acertarem todas as letras
                //sem adivinhar
                  src.itens.color = colorIs(src.chances);
                  src.itens.title = ':x: FIM DE JOGO';
                  src.itens.desc = 'Ninguém adivinhou a palavra';
                  src.itens.footer.text = ':(';
                  src.answ.edit({ embeds: [embedMess(src.itens)] });
                  all.ativos[message.channelId] = undefined;
                  reset(all, dados);
                } else {
                    //se ainda tiverem letras nao
                    //descobertas
                    src.itens.color = colorIs(src.chances);
                    src.itens.title = 'RESTAM ' + src.chances + ' ERROS';
                    if (src.jaErrou == true) {
                      src.itens.footer.text = 'Já foram: ' + foram(src);
                    }
                    src.itens.desc = src.segredo;
                    src.answ.edit({ embeds: [embedMess(src.itens)] });
                }
            } //Fecha o se houver acerto
          } else {
           //se o palpite ja foi usado
              message.delete()
                //.then(msg => console.log(`Mensagem de ${msg.author.username} foi deletada`))
                .catch(console.error);
          } //fecha o else palpite ja foi usado
        } else { //fecha o if palpite isLetra
            message.delete()
              .catch(console.error);
        }
      } else {
            //Se o tamanho do palpite for igual ao
            //tamanho da palavra
            src.palpite = src.palpite.toLowerCase();

            //se palpite em palavra estiver
            //certo
            if (src.palpite == src.palavra) {
                src.message.delete()
            	vitoria(src, all);
            } else {
                if (src.chances > 0) {
                  src.chances--;
                  upSegredo(src);
                  src.itens.color = colorIs(src.chances);
                  src.itens.title = 'RESTAM ' + src.chances + ' ERROS';
                  src.itens.desc = src.segredo;
                  if (src.jaErrou == true) {
                    src.itens.footer.text = 'Já foram: ' + foram(src);
                  }
                  message.delete()
                    .catch(console.error);
                  src.answ.edit({ embeds: [embedMess(src.itens)] });
                } else {
                    //se acabarem as tentativas
                    message.delete()
                      .catch(console.error);
                    gameOver(src, all);
                    return;
                }
            }
        } //fecha o else tamanho palpite = tamanho palavra
  } //fecha o else do primeiro if
} //fecha o modulo.exports
