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

module.exports.capit = function() {
  let string = this.toString();
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

module.exports.random = function(n) {
  let max = n + 1;
  return Math.floor(Math.random() * max);
};
