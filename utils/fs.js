const fs = require('fs');
//var filename = process.argv[2];
//var data = process.argv[3];

fs.writeFile(filename, data, err => {
    if (err) {
       throw err;
    }
    console.log('Arquivo "' + filename + '" criado');
});

fs.readFile(filename, (err, content) => {
    if (err) {
        throw err;
    };
    var text = '' + content;
    console.log(text);
});
