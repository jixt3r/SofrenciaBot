const fs = require('fs');
var teste = 'branco';
var array = [1, 0];

func = (teste) => {
   //console.log(teste);
   return 'so';
}

if (array[0] == 1) {
    //console.log('sim');
}

fs.writeFile('test.json', JSON.stringify(json), err => {
    if (err) {
       throw err;
       return;
    }
});

console.log(json.b);
