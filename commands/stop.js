const {useQueue} = require('discord-player');
const {isValidVoiceChannel} = require('../utils/validate');

module.exports = {
  name: 'stop',
  description: 'Stop all songs in the queue!',
  async execute(interaction, player) {
    await interaction.deferReply();

    if (!isValidVoiceChannel(interaction)) {
      return;
    }

    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.isPlaying()) {
      return void interaction.followUp({
        content: '❌ | Chưa mở nhạc sao tui hát ?',
      });
    }

    queue.delete();
    return void interaction.followUp({content: '🛑 | Ôkê không hát nữa'});
  },
};
