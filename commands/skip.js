const {useQueue} = require('discord-player');
const {isValidVoiceChannel} = require('../utils/validate');

module.exports = {
  name: 'skip',
  description: 'Skip a song!',
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

    const success = queue.node.skip();
    return void interaction.followUp({
      content: success ? `✅ | Ôkê chuyển bài **${currentTrack}**!` : '❌ | Có gì sai sai rồi bạn ơi !',
    });
  },
};
