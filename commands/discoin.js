const { MessageActionRow, MessageButton } = require('discord.js');
const { inMili } = require(`${cwd}/files/funcs`);
const fs = require('fs');
const color = '#32A856'
discoin = {};

class User {
  constructor(name) {
    this.coins = 0;
    this.inv = 0;
  };
};

const snow = new RegExp('[0-9]{17}');

const filter = (m) => true;

const lowData = (guild) => {
  let gFile = `${cwd}/db/guilds/${guild.id}/discoin.json`;
  let db = fs.readFileSync(gFile, 'utf8');
  return JSON.parse(db);
};

const upStatus = async (guild) => {
  let db = discoin[guild.id].infos;
  let chanId = db.chanId;
  let msgId = db.msgId;
  let cambio = db.cambio;
  let last = db.last;
  if (snow.test(last)) last = `<@${last}>`;
  let miners = db.miners.length;
  let gain = db.gain;
  let msg;
  try {
    let chan = await guild.channels.fetch(chanId);
    msg = await chan.messages.fetch(msgId);
  } catch (err) {
    return console.log("-- Erro! Canal de mineração ou mensagem-status não encontrada");
  };
  let embed = {
    color: color,
    title: 'STATUS',
    //description: `Aquele que minerar mais ganhará ${gain} discoins`
  };
  embed.fields = [
    { name: 'Câmbio atual', value: `1 discoin vale ${cambio} alfacoin`,
      inline: true },
    { name: 'Usuários minerando', value: `${miners}`,
      inline: true },
    { name: 'Último ganhador', value: `${last}`,
      inline: true } ];
  //let inv = new MessageButton({
  //label: 'Minerar', customId: 'min',
  //emoji: '', style: 'SUCCESS' });
  //let act = new MessageActionRow({ components: [ min ] });
  msg.edit({ embeds: [ embed ] });
};

const save = (guild) => {
  let gFile = `${cwd}/db/guilds/${guild.id}/discoin.json`;
  fs.writeFileSync(gFile, JSON.stringify(discoin[guild.id]));
};

jaTem = async (id, guild) => {
  return await guild.channels.cache.find(c => c.topic == id);
};

const dec = (value) => {
  return value.toLocaleString(
    'pt-BR', { style: 'decimal' }
  );
};

const winner = (guild) => {
  let data = discoin[guild.id];
  let miners = data.infos.miners;
  let pars = new Map();
  let hist = [];
  for (id of miners) {
    let inv = data.users[id].inv;
    hist.push(inv);
    pars.set(inv, id)
  };
  let asce = (a, b) => {
    return b - a;
  };
  hist.sort(asce);
  let high = hist[0];
  let winnerId = pars.get(high);
  return winnerId || 'Ninguém';
};

const refresh = async (guild) => {
  console.log("\n- Refresh iniciado");
  let data = discoin[guild.id];
  let chanId = data.infos.chanId;
  let msgId = data.infos.msgId;
  let gain = data.infos.gain;

  let msg;
  try {
    let chan = await guild.channels.fetch(chanId);
    msg = await chan.messages.fetch(msgId);
  } catch (err) {
    return console.log("-- Erro! Canal de mineração ou mensagem-status não encontrada");
  };

  let embed = msg.embeds[0];

  let inv = 0;
  for (miner of data.infos.miners) {
    inv += data.users[miner].inv;
    data.users[miner].inv = 0;
  };
  let med = inv / data.infos.miners.length;
  if (!med) med = 0;

  data.infos.last = winner(guild);
  if (data.infos.last != 'Ninguém')
    data.users[data.infos.last].coins += gain;

  let meds = data.infos.med;
  meds.shift();
  meds.push(med);
  console.log(`- Últimos investimentos: ${data.infos.med}`);

  let sum = 0;
  for (med of data.infos.med) sum += med;

  console.log(`- Soma dos últimos investimentos: ${sum}`);
  data.infos.cambio = dec(sum/7/gain);
  console.log(`- Valor médio de 1 discoin: ${data.infos.cambio}`);
  data.infos.miners = [];
  save(guild);
  upStatus(guild);
};

//--------------------------------------------------\\

module.exports = {

  init: (guild) => {
    discoin[guild.id] = lowData(guild);
    upStatus(guild);
    if (discoin[guild.id])
      setInterval(refresh, inMili('00:00:10'), guild);
  },


  create: async (guild) => {
    let guildDir = `${cwd}/db/guilds/${guild.id}`;

    let has = async (name) => {
      let channels = await guild.channels.fetch();
      return await channels.find(chan =>
        chan.type == 'GUILD_CATEGORY' && chan.name == name);
    };

    let category = await has('Discoin');

    if (!category) category = await guild.channels
     .create('Discoin', { type: 'GUILD_CATEGORY' });

    let comerc = await category.createChannel('comércio');
    comerc = await comerc.fetch();
    let minera = await category.createChannel('mineração',
      { topic: 'Uma vez por dia 100 discoins serão dados à quem minerar mais' });
    minera = await minera.fetch();

    let embed = {
      color: color,
      title: 'STATUS',
      //description: `Aquele que minerar mais ganhará 100 discoins`
    };
    embed.fields = [
      { name: 'Câmbio atual',
        value: '1 discoin vale 0 alfacoin',
        inline: true },

      { name: 'Usuários minerando', value: '0',
        inline: true },

      { name: 'Último vencedor', value: 'Ninguém',
        inline: true } ];

    let min = new MessageButton({
      label: 'Minerar', customId: 'min',
      //emoji: '',
      style: 'SUCCESS' } );

    let act = new MessageActionRow({ components: [ min ] });
    let infos = await minera.send({ embeds: [ embed ], components: [ act ] });
    let data = JSON.stringify(
{
  infos: {
    chanId: minera.id,
    msgId: infos.id,
    last: 'Ninguém',
    gain: 100,
    cambio: 0,
    med: [ 0, 0, 0, 0, 0, 0, 0 ],
    miners: []
  },
  users: {}
} );
    await fs.mkdir(guildDir, () => {});
    fs.writeFileSync(`${guildDir}/discoin.json`, data)
    discoin[guild.id] = lowData(guild);
  },


  run: (m, args, chan, content) => {
    if (!args[1]) return;
    return module.exports[args[1]](m.guild);
  },

  responsive: async (i, msg, chan) => {
    if (!i) {
      let guild = msg.guild;
      if (msg.content.toLowerCase() == 'sair' && msg.author.id == chan.topic) {
        return chan.delete();
      };
      if (!msg.author.bot || !msg.embeds[0]) return;
      if (!msg.embeds[0].description.includes('fez uma transferência de')) return;
      let db = discoin[guild.id];
      if (!db.users[chan.topic]) db.users[chan.topic] = new User();
      let user = db.users[chan.topic];
      let args = msg.embeds[0].description.split(' ');
      let valor = args[args.length-1];
      valor = valor.slice(3, valor.length-3);
      let embed = {
        color: color,
        description: `Pagamento efetuado no valor de **$${valor}**.`
      };
      await chan.send({ embeds: [ embed ] });
      valor = Number(valor.replace(",", ""));
      if (!db.infos.miners.includes(chan.topic)) db.infos.miners.push(chan.topic);
      user.inv += valor;
      save(guild);
      upStatus(guild);
      return;
    };
    switch (i.customId) {
      case 'min':
        let guild = i.guild;
        let guildMember = await guild.members
         .fetch(i.user.id);
        let cName = `${guildMember.nickname || i.user.username}`.toLowerCase();
        let tem = await jaTem(guildMember.id, guild);
        if (tem) return i.reply({
          content: `Já existe um canal para você em ${tem}.`,
          ephemeral: true });
        let pv = await guild.channels.create(cName,
          { permissionOverwrites: [
              { id: guild.id,
                deny: [ 'VIEW_CHANNEL' ] },
              { id: i.user.id,
                allow: [ 'VIEW_CHANNEL' ] } ],
            position: 0,
            topic:`${guildMember.id}` } );

        let embed = {
          title: 'COMO MINERAR',
          color: color,
          description: `Para minerar mencione o <@393094770794299392> e quando ele estiver online execute o comando abaixo depois espere a tranferência ser aceita. Faça quantas quiser e envie **sair** quando quiser fechar este canal.
***..transferir <@393094770794299392> <valor para investir>***`
        };
        await pv.send({ embeds: [ embed ] });
        break;
    };
    await i.update({ components: i.message.components });
  } //Responsive

}
