
const { MessageActionRow, MessageButton } = require('discord.js');

//----------------------------------------------------

exports.run = async (message, args, chan, content) => {
  let but = {};
  const letras = [ "a","b","c","d","e","f","g","h",
                   "i","j","k","l","m","n","o","p",
                   "q","r","s","t","u","v","w","x",
                   "y","z"];
  for (l of letras) {
    but[l] = new MessageButton({
      label: l.toUpperCase(),
      customId: l,
      //emoji: null,
      style: 'SECONDARY',
    });
  };
  but.more = new MessageButton({
      label: '...',
      customId: 'more',
      //emoji: "",
      style: 'SECONDARY',
    });
  but.set = new MessageButton({
      //label: '',
      customId: 'set',
      emoji: "✔️",
      style: 'SUCCESS',
    });
  abcde = new MessageActionRow({
    components: [ but.a, but.b, but.c, but.d, but.e ] });
  fghij = new MessageActionRow({
    components: [ but.f, but.g, but.h, but.i, but.j ] });
  klm = new MessageActionRow({
    components: [ but.k, but.l, but.m, but.more, but.set ] });
  let answ = await chan.send({
    components: [ abcde, fghij, klm ]});
};

