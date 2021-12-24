const { MessageEmbed } = require('discord.js');
const DESIGN = require('../../resources/design.json');

module.exports = {
  config: {
    cooldown: 10,
    locked: true
  },
  run: async (button, args, { prometheus }) => {
    let thread = await button.bot.channels.fetch(args[1]);
    let embed = new MessageEmbed()
      .setColor(DESIGN.white)
      .setDescription(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\nThis thread will be deleted in 15 secconds\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`)
    button.reply({ embeds: [embed] }).then(done => {
      setTimeout(() => {
        prometheus.query(`UPDATE Tickets SET thread = null WHERE channel = ${args[0]}`)
        thread.delete()
      }, 15000);
    })
  },
};