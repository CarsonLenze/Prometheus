const { Collection } = require('discord.js');
const hd = require('humanize-duration');

let cooldownCache = new Collection();
function checkCooldown(command, id, cooldown, isButton) {
  if (!command) return console.trace(`'command' undefined`);
  if (typeof (command) !== 'string') return console.trace(`'command' must be type of String`);
  if (!id) return console.trace(`'id' undefined`);
  if (typeof (id) !== 'string') return console.trace(`'id' must be type of String`);
  if (!cooldown) return console.trace(`'cooldown' undefined`);
  if (typeof (cooldown) !== 'number') return console.trace(`'cooldown' must be type of Number`);
  let name = command + '-c'
  if (isButton) name = command + '-b'

  let userCache = cooldownCache.get(id);
  if (userCache) {
    let ends = userCache.get(name);
    if (ends) {
      if (ends > Date.now()) {
        let string;
        (isButton) ? string = `the \`${command.charAt(0).toUpperCase() + command.slice(1)}\` button` : string = `\`/${command}\``;
        return { cooldown: true, message: `You can use ${string} again in \`${hd(ends - Date.now(), { round: true })}\`!` };
      } else {
        userCache.delete(name);
        userCache.set(name, Date.now() + (cooldown * 1000));
        return { cooldown: false };
      }
    } else {
      userCache.set(name, Date.now() + (cooldown * 1000));
      return { cooldown: false };
    }
  } else {
    cooldownCache.set(id, new Collection());
    userCache = cooldownCache.get(id);
    userCache.set(name, Date.now() + (cooldown * 1000));
    return { cooldown: false };
  }
}

function colorify(string, color = 'green') {
  switch (color) {
    case 'pass':
      color = 90;
      break;
    case 'fail':
      color = 31;
      break;
    case 'bright pass':
      color = 92;
      break;
    case 'bright fail':
      color = 91;
      break;
    case 'bright yellow':
      color = 93;
      break;
    case 'aqua':
      color = 36
      break;
    default:
      color = 32;
  }
  return `\u001b[${color}m${string}\u001b[0m`;
}

module.exports = {
  checkCooldown,
  colorify
};