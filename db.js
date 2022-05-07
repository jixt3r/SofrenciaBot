const NoSQL = require('nosql');
var db = NoSQL.load("./db/channels.nosql");

//db.modify({ age: 'val + 10' }).where('age', "40");
db.find()
 .where('age', 20)
 .fields('name')
 .callback((err, res) => {
   console.log(res[0].name);
});
