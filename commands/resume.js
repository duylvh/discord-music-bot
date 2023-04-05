const {useQueue} = require('discord-player');
const {isValidVoiceChannel} = require('../utils/validate');

module.exports = {
  name: 'resume',
  description: 'Resume current song!',
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

    const success = queue.node.resume();
    return void interaction.followUp({
      content: success ? '▶ | Ôkê hát tiếp' : '❌ | Có gì sai sai rồi bạn ơi !',
    });
  },
};
