const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports.embedMess = (itens) => {
  return new MessageEmbed({
    color: itens.color,
    author: itens.author,
    url: itens.url,
    title: itens.title,
    thumbnail: itens.thumb,
    description: itens.desc,
    //timestamp: new Date(2005, 8, 5, 22, 30, 0).getTime(),
    fields: itens.fields,
    image: itens.image,
    video: itens.video,
    footer: itens.footer
  });
}

module.exports.inMili = (time) => {
  let times = time.split(':');
  let horas = times[0];
  let min = times[1];
  let seg = times[2];
  return horas * 3600000 + min * 60000 + seg * 1000;
};

module.exports.capit = function() {
  let string = this.toString();
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

module.exports.random = (max) => {
  let imp = max + 1;
  return Math.floor(Math.random() * imp);
};

module.exports.remoji = function(mess, emoji, user) {
  mess.reactions.cache.get(emoji).users.remove(user);
};

