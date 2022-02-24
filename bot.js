const fs = require('fs');
const { log } = require('./functions/utility.js')
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config/validation.json');
const { createAudioPlayer } = require('@discordjs/voice');
const { play } = require('./functions/soundboard.js')

// Create the client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Session storage
const session = {}

// Set the commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Add to the collection
    client.commands.set(command.data.name, command);
};

// Execute if command gets run
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) { return };

    const command = client.commands.get(interaction.commandName);

    if (!command) { return };

    try {
        await command.execute(interaction, session)
    } catch (error) {
        console.log(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    };
});


// Execute when button gets pressed
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) { return };

    play(interaction, session);
});


// When client is ready
client.once('ready', _ => {
    const player = createAudioPlayer();
    session.player = player;

    log('bot', 'Client is ready');
});

// Login
client.login(token)