const {Client, Collection} = require('discord.js');

module.exports = class extends Client {
  constructor(config) {
    super({
      intents: ['GuildVoiceStates', 'GuildMessages', 'Guilds', 'MessageContent', 'GuildMembers', 'GuildBans'],
    });

    this.commands = new Collection();

    this.queue = new Map();

    this.config = config;
  }
};
