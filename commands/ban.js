module.exports = {
  name: 'ban',
  description: 'Ban a player',
  options: [
    {
      name: 'user',
      type: 6, //USER Type
      description: 'Bạn muốn ban thằng nào',
      required: true,
    },
  ],
  execute(interaction, client) {
    const member = interaction.options.get('user').value;

    if (!member) {
      return message.reply('Sao lại ban nhau thế :< ?');
    }

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('Anh này mạnh quá em ban không nổi.');
    }

    const userinfo = client.users.cache.get(member);

    return interaction.guild.members
      .ban(member)
      .then(() => {
        interaction.reply({
          content: `${userinfo.username} đã bị ban.`,
          ephemeral: true,
        });
      })
      .catch(error => {
        console.warn(error);
        interaction.reply({
          content: `xin lỗi, có lỗi gì rồi bạn ơi.`,
          ephemeral: true,
        });
      });
  },
};
