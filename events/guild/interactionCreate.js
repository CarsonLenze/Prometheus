const { checkCooldown } = require('../../resources/functions.js');
const { Database } = require('../../resources/database.js');
const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = async (bot, interaction) => {
  /* 
  --------------------------------------------------
  Allowed config options: 
  - ?name (String)
  - ?locked (Boolean)
  - ?cooldown (Integer)
  - ?allowBots (Boolean)
  --------------------------------------------------
  */

  interaction.channel = await bot.channels.fetch(interaction.channel.id);
  interaction.guild = await bot.guilds.fetch(interaction.guild.id);
  interaction.bot = bot;
  interaction.author = interaction.member.user;
  interaction.member = await interaction.guild.members.fetch(interaction.author.id);

  let file;
  (!interaction.componentType) ? file = bot.commands.get(interaction.commandName) : file = bot.buttons.get(interaction.customId.split('-')[0] || interaction.customId);
  if (!file) return;

  if (file.config.locked && !interaction.member.permissions.has("ADMINISTRATOR")) {
    let noPermissionsEmbed = new MessageEmbed()
      .setDescription(`${DESIGN.redx} __Missing Permmissions:__ You can not run this command.`)
      .setColor(DESIGN.invis)

    return interaction.reply({ embeds: [noPermissionsEmbed], ephemeral: true });
  }

  if (file.config.cooldown && !interaction.author.bot) {
    if (interaction.componentType) interaction.commandName = interaction.customId.split('-')[0];
    let cooldownCheck = checkCooldown(interaction.commandName, interaction.member.id, file.config.cooldown, interaction.customId);
    let embed = new MessageEmbed()
      .setDescription(`${DESIGN.redx} __Cooldown:__ ${cooldownCheck.message}`)
      .setColor(DESIGN.invis)

    if (cooldownCheck.cooldown) return interaction.reply({ ephemeral: true, embeds: [embed] });
  }

  let args = [];
  if (interaction.options) interaction.options._hoistedOptions.forEach(x => { args.push({ type: x.type, value: x.value }) });

  let containsBot = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i].type !== 'USER') {
      args[i] = args[i].value;
    } else {
      let member = await interaction.user.fetch(args[i].value);
      if (member.user.bot) containsBot = true;
    }
  }

  if (args.length < 1) args = undefined;
  if (interaction.componentType) {
    args = interaction.customId.split('-');
    args.shift();
    if (interaction.values) for (const value of interaction.values) args.push(value);
  }

  if (interaction.componentType) {
    args = interaction.customId.split('-');
    args.shift();
  }

  let botEmbed = new MessageEmbed()
    .setDescription(`${DESIGN.redx} __Mentioned Bot:__ \`/${interaction.commandName}\` does not allow bots to be mentioned.`)
    .setColor(DESIGN.invis)

  if (!file.config.allowBots && containsBot) return interaction.reply({ ephemeral: true, embeds: [botEmbed] });

  let db = new Object()
  db.prometheus = new Database('Prometheus');
  
  file.run(interaction, args, db);

  setTimeout(() => {
        db.prometheus.close();
    }, 30000);
}