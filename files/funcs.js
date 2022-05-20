module.exports = {

  inMili: (time) => {
    if (!time) return;
    let fields = time.split(':');
    let horas = fields[0];
    let min = fields[1];
    let seg = fields[2];
    let milis = seg * 1000;
    if (fields.length > 1) {
      milis += min * 60000;
    };
    if (fields.length == 3) {
      milis += horas * 3600000;
    };
    return milis;
  },

  capit: () => {
    let string = this.toString();
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  },

  random: (max) => {
    let imp = max + 1;
    return Math.floor(Math.random() * imp);
  }

};
