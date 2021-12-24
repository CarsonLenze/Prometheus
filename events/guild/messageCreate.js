const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Database } = require('../../resources/database.js');
const DESIGN = require('../../resources/design.json');

module.exports = async (bot, message) => {

  if (message.channel.parentId == "919775893373726770") {
    let db = new Database('Prometheus');
    let ticket = await db.query(`SELECT * FROM Tickets WHERE channel = ${message.channel.id}`)
    if (!ticket) return db.close()
    let array = JSON.parse(ticket.users)
    if (array.includes(message.author.id)) return db.close()
      array.push(message.author.id)
      array = JSON.stringify(array)
      await db.query(`UPDATE Tickets SET users = '${array}' WHERE channel = ${message.channel.id}`)
      await db.close();
  }
  if (message.author.id == "404336524491227149" && message.content == "!embed") {

    let ROW = new MessageActionRow()
      .addComponents([
        new MessageButton()
          .setCustomId(`ticket`)
          .setLabel('Create Ticket')
          .setStyle('SUCCESS'),
      ])

    let emebed = new MessageEmbed()
      .setColor(DESIGN.white)
      .setTitle('➤ Create a ticket')
      .setDescription('In order to receive help from our staff team, click the create a ticket button. \n\n⋆﹥━━━━━━━━━━━━━━━﹤⋆\n➣ YOU MAY OPEN A TICKET TO:\n\n➴ Report a server member.\n➴ Report a member of the staff team.\n➴ Report an error within our server.\n➴ Claim a giveaway prize.\n\n⋆﹥━━━━━━━━━━━━━━━﹤⋆\n➥ Please do not ping any member of the staff team within your ticket.')
    message.channel.send({ embeds: [emebed], components: [ROW] })
  }
}