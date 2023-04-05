const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {token, prefix} = require('./config.json');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`🎶 | Chuẩn bị hát nè: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Đã thêm bài **${track.title}** vô hàng chờ!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | tui hát mệt quá tui nghỉ nha , hàng chờ đã bị xóa !');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | Mọi người đi hết rồi, tui hát cho nghe mà sao bỏ tui đi là sao ?');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Hết nhạc rồi nhe , nghe nữa Phúc hát nữa cho nghe ?');
});

client.once('ready', async () => {
  console.log('Ready!');
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) {
    return;
  }
  if (!message.content.startsWith(prefix)) {
    return;
  }

  if (!client.application?.owner) {
    await client.application?.fetch();
  }

  if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('Hi, bạn muốn nghe Phúc hát hả, /play để chọn bài hát, /help để xem danh sách lệnh nhé !');
      })
      .catch(err => {
        message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'There was an error trying to execute that command!',
    });
  }
});

client.login(token);
