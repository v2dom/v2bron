require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Ready event when the bot has logged in
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Register slash commands
  await client.application.commands.create({
    name: 'ping',
    description: 'Replies with Pong!',
  });

  await client.application.commands.create({
    name: 'robert',
    description: 'Fuck rob ong',
  });

  console.log('Commands registered!');
});

// Handling interaction events (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'robert') {
    await interaction.reply('Fuck rob ong');
  }
});

// Log in to Discord using the token from the .env file
client.login(process.env.TOKEN);
