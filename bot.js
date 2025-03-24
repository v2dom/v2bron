require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const player = createAudioPlayer();
const queue = [];
let currentSong = null;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const commands = [
    { name: 'ping', description: 'Replies with Pong!' },
    { name: 'kick', description: 'Kicks a user', options: [{ name: 'user', type: 6, description: 'User to kick', required: true }] },
    { name: 'remindme', description: 'Sets a reminder', options: [{ name: 'time', type: 3, description: 'Time in seconds', required: true }, { name: 'task', type: 3, description: 'Task to remind about', required: true }] },
    { name: 'play', description: 'Plays audio in a voice channel', options: [{ name: 'query', type: 3, description: 'YouTube/Spotify URL or search query', required: true }] },
    { name: 'stop', description: 'Stops audio playback' },
    { name: 'pause', description: 'Pauses the current song' },
    { name: 'resume', description: 'Resumes the paused song' },
    { name: 'skip', description: 'Skips the current song' },
    { name: 'queue', description: 'Shows the current queue' },
    { name: 'nowplaying', description: 'Displays the currently playing song' }
  ];

  for (const command of commands) {
    await client.application.commands.create(command);
  }

  console.log('Commands registered!');
});

async function playNextSong(connection) {
  if (queue.length === 0) {
    currentSong = null;
    return;
  }
  currentSong = queue.shift();
  const stream = await play.stream(currentSong);
  const resource = createAudioResource(stream.stream, { inputType: stream.type });
  player.play(resource);
  connection.subscribe(player);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options, member, guild } = interaction;
  const voiceChannel = member.voice.channel;
  if (!voiceChannel && ['play', 'pause', 'resume', 'skip', 'queue', 'nowplaying'].includes(commandName)) {
    return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
  }

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'kick') {
    if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
    const user = options.getUser('user');
    const memberTarget = interaction.guild.members.cache.get(user.id);
    if (memberTarget) {
      await memberTarget.kick();
      await interaction.reply(`${user.tag} has been kicked.`);
    } else {
      await interaction.reply('User not found.');
    }
  } else if (commandName === 'remindme') {
    const time = parseInt(options.getString('time'));
    const task = options.getString('task');
    await interaction.reply(`Reminder set! I'll remind you in ${time} seconds.`);
    setTimeout(() => {
      interaction.followUp(`⏰ Reminder: ${task}`);
    }, time * 1000);
  } else if (commandName === 'play') {
    const query = options.getString('query');
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    queue.push(query);
    if (!currentSong) {
      playNextSong(connection);
    }
    await interaction.reply(`Added to queue: ${query}`);
  } else if (commandName === 'stop') {
    player.stop();
    queue.length = 0;
    await interaction.reply('Stopped audio playback.');
  } else if (commandName === 'pause') {
    player.pause();
    await interaction.reply('Paused the current song.');
  } else if (commandName === 'resume') {
    player.unpause();
    await interaction.reply('Resumed the song.');
  } else if (commandName === 'skip') {
    if (queue.length === 0) {
      return interaction.reply('No songs in the queue to skip.');
    }
    playNextSong(joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    }));
    await interaction.reply('Skipped to the next song.');
  } else if (commandName === 'queue') {
    if (queue.length === 0) {
      await interaction.reply('The queue is empty.');
    } else {
      await interaction.reply(`Current queue:\n${queue.join('\n')}`);
    }
  } else if (commandName === 'nowplaying') {
    if (currentSong) {
      await interaction.reply(`Now playing: ${currentSong}`);
    } else {
      await interaction.reply('No song is currently playing.');
    }
  }
});

client.login(process.env.TOKEN);
