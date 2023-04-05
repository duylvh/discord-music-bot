const {GuildMember} = require('discord.js');

const isValidVoiceChannel = interaction => {
  if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
    interaction.reply({
      content: 'Vô channel đi rồi mới nghe Phúc hát được chứ !',
      ephemeral: true,
    });
    return false;
  }
  if (interaction.guild.members.me.voice.channel.id !== interaction.member.voice.channel.id) {
    interaction.reply({
      content: 'Vô channel đi rồi mới nghe Phúc hát được chứ !',
      ephemeral: true,
    });
    return false;
  }
  return true;
};

module.exports = {
  isValidVoiceChannel,
};
