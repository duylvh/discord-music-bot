const {GuildMember} = require('discord.js');
const {QueryType} = require('discord-player');

module.exports = {
  name: 'play',
  description: 'Play a song in your channel!',
  options: [
    {
      name: 'query',
      type: 3, // 'STRING' Type
      description: 'The song you want to play',
      required: true,
    },
  ],
  async execute(interaction, player) {
    try {
      if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({
          content: 'Vô channel đi rồi mới nghe Phúc hát được chứ !',
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const query = interaction.options.get('query').value;
      const result = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
      if (!result || !result.tracks.length) {
        return void interaction.followUp({content: 'Phúc không biết bài này!'});
      }

      await interaction.followUp({
        content: `⏱ | Để Phúc hót cho nghe ${result.playlist ? 'playlist' : 'nha'}...`,
      });

      const queue = player.nodes.create(interaction.guild, {
        metadata: {
          channel: interaction.channel,
          client: interaction.guild.members.me,
          requestedBy: interaction.user,
        },
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
      });

      try {
        if (!queue.connection) {
          await queue.connect(interaction.member.voice.channel);
        }
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          content: 'Phúc bị lỗi gì rồi, không vô channel được :((( ',
        });
      }

      queue.addTrack(result.tracks);
      if (!queue.node.isPlaying()) {
        queue.node.play();
      }
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
