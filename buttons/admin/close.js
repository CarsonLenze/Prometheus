const { MessageEmbed } = require('discord.js');
const DESIGN = require('../../resources/design.json');

module.exports = {
  config: {
    cooldown: 10,
    locked: true
  },
  run: async (button, args, { prometheus }) => {
    let channel = await button.bot.channels.fetch(args[1]);
    let embed = new MessageEmbed()
      .setColor(DESIGN.white)
      .setDescription(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\nThis channel will be deleted in 15 secconds\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`)
    button.reply({ embeds: [embed] }).then(done => {
      setTimeout(() => {
        prometheus.query(`DELETE FROM Tickets WHERE user = ${args[0]}`)
        channel.delete()
      }, 15000);
    })
  },
};