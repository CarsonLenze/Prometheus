const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const DESIGN = require('../../resources/design.json');

module.exports = {
  config: {
    cooldown: 10,
    locked: true
  },
  run: async (button, args, { prometheus }) => {
    let allowed = await prometheus.query(`SELECT * FROM Tickets WHERE channel = ${args[1]}`)
        let open = new MessageEmbed()
        .setColor(DESIGN.red)
        .setDescription(`${DESIGN.redx} There is allready a thread open.`)
    if (allowed.thread) return button.reply({ embeds: [open], ephemeral: true })
    button.deferUpdate()
    let channel = await button.bot.channels.fetch(args[1]);
    let name = channel.name.split('-')

    await channel.threads.create({
      name: `thread-${name[1]}`,
      autoArchiveDuration: 4320,
    }).then(async thread => {
    let can = await button.bot.channels.fetch(args[1]);
    let message = await can.messages.fetch(can.lastMessageId);
    message.delete()

          let ROW = new MessageActionRow()
        .addComponents([
          new MessageButton()
            .setCustomId(`resolve-${args[1]}-${thread.id}`)
            .setLabel('Resolve')
            .setStyle('DANGER')
        ])

    let embed = new MessageEmbed()
        .setColor(DESIGN.white)
        .setDescription(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\nThis thread is staff only. Please do not ping any users.\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`)
    thread.send({ content: 'role', embeds: [embed], components: [ROW] });

    await prometheus.query(`UPDATE Tickets SET thread = '${thread.id}' WHERE channel = ${can.id}`)
    })
  },
};