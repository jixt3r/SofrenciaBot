const { MessageEmbed } = require('discord.js');

module.exports.inMili = (time) => {
  let times = time.split(':');
  let horas = times[0];
  let min = times[1];
  let seg = times[2];
  return horas * 3600000 + min * 60000 + seg * 1000;
};

module.exports.capit = () => {
  let string = this.toString();
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

module.exports.random = (max) => {
  let imp = max + 1;
  return Math.floor(Math.random() * imp);
};
