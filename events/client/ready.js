const { colorify } = require('../../resources/functions.js');
let localCommands = require('../../resources/commands.json')

module.exports = async (bot) => {
    global.c = (type = 'INFO') => {
    switch (type.toLowerCase()) {
      case 'info':
        return `${colorify('INFO', 'bright yellow')} |`;
      case 'warn':
        return `${colorify('WARN', 'bright red')} |`;
      case 'err':
        return `${colorify('ERROR', 'red')} |`;
    }
  }

  let commands = await bot.application?.commands?.fetch();
  commands = commands.map(({ name, description, options }) => ({ 
    name: name,
    description: description,
    options: options,
  }))
  if (JSON.stringify(commands) != JSON.stringify(localCommands)) {
    try {
      await bot.application.commands ?.set(localCommands);
      console.log(`${c('INFO')} Updated slash commands (ready.js)`);
    }
    catch (err) {
      console.trace(`${c('ERR')} Failed to update commands (ready.js)`);
      console.trace(err);
    }
  } else {
    console.log(`${c('INFO')} No new commands to update (ready.js)`)
  }

  await bot.user.setActivity(`${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users!`, { type: `WATCHING` });
  //bot.user.setUsername('Prometheus');
  console.log(`${colorify('ONLINE', 'bright green')} | ${bot.user.tag} is now online watching ${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users(s)!`);
}