const {useQueue} = require('discord-player');
const {isValidVoiceChannel} = require('../utils/validate');

module.exports = {
  name: 'nowplaying',
  description: 'Get the song that is currently playing.',
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

    const track = queue.currentTrack;
    const progressBar = queue.node.createProgressBar();
    const progressPer = queue.node.getTimestamp();

    return void interaction.followUp({
      embeds: [
        {
          title: 'Phúc đang hát bài',
          description: `🎶 | **${track.title}**! (\`${progressPer.progress}%\`)`,
          fields: [
            {
              name: '\u200b',
              value: progressBar,
            },
          ],
          color: 0xffffff,
        },
      ],
    });
  },
};
