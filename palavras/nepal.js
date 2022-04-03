//const http = require('http');
const axios = require('axios')
const fs = require('fs')
var palavras;
const file = 'palavras.txt';
var array = [];

for(var i = 0; i < 100; i++) {
axios
  .get('https://api.dicionario-aberto.net/random')
  .then(res => {
     if (res.data.word.length > 4 && res.data.word.length < 11 && res.data.word.search('-') == -1 && res.data.word.search('y') == -1 && res.data.word.search('.') == 0) {
       array.push(res.data.word);
       fs.writeFile(file, array.join(), err => {
         if (err) {
           throw err;
         }
       })
     }
  })
  .catch(error => {
    console.error(error)
  })
}
