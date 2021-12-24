const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const DESIGN = require('../../resources/design.json');

module.exports = {
  config: {
    cooldown: 10,
    name: "ticket"
  },
  run: async (interaction, args, { prometheus }) => {

    let allowed = await prometheus.query(`SELECT * FROM Tickets WHERE user = ${interaction.author.id}`)
    let open = new MessageEmbed()
        .setColor(DESIGN.invis)
        .setDescription(`${DESIGN.redx} You already have a ticket open.`)
    if (allowed) return interaction.reply({ embeds: [open], ephemeral: true })

    let category = interaction.guild.channels.cache.get('919775893373726770');
    let data = await prometheus.query(`SELECT * FROM TicketNum`);
    data = data.Ticket
    data++
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    await prometheus.query(`UPDATE TicketNum SET Ticket = '${data}'`)

    interaction.guild.channels.create(`ticket-${zeroPad(data, 4)}`, {
      type: 'text',
      parent: category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.author.id,
          allow: ['VIEW_CHANNEL'],
        }]
    }).then(async channel => {

      await prometheus.query(`INSERT INTO Tickets (user, channel, guild, thread, users) VALUES (${interaction.author.id}, ${channel.id}, ${interaction.guild.id}, null, '[]')`)

      let created = new MessageEmbed()
        .setDescription(`${DESIGN.check} Your ticket has been created. click [here](https://discord.com/channels/${channel.guild.id}/${channel.id}) to access it.`)
        .setColor(DESIGN.invis);

      interaction.reply({ embeds: [created], ephemeral: true })

      let ROW = new MessageActionRow()
        .addComponents([
          new MessageButton()
            .setCustomId(`close-${interaction.author.id}-${channel.id}`)
            .setLabel('Close')
            .setStyle('DANGER'),
          new MessageButton()
            .setCustomId(`thread-${interaction.author.id}-${channel.id}`)
            .setLabel('Thread')
            .setStyle('SECONDARY'),
        ])

      let emebed = new MessageEmbed()
        .setColor(DESIGN.white)
        .setDescription(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\nWelcome to our support room, please describe your issue to our staff team. \n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`)
      //<@&918207602238832650>
      channel.send({ content: `${interaction.author} your ticket has been created! (role)`, embeds: [emebed], components: [ROW] })
    })
  },
};