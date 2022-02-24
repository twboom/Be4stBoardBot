const fs = require('fs');
const { log, getPath } = require('./functions/utility.js')
const { Client, Collection, Intents } = require('discord.js');
const { token } = require(getPath('authentication'));
const { createAudioPlayer } = require('@discordjs/voice');
const { play } = require('./functions/soundboard.js');
const path = require('path');

// Create the client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// Session storage
const session = {}

// Set the commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Add to the collection
    client.commands.set(command.data.name, command);
};

log('bot', 'Loaded commands')

// Execute if command gets run
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) { return };

    const command = client.commands.get(interaction.commandName);
    const user = interaction.user;

    log('interaction', `${user.tag} ran ${interaction.toString()}`)

    if (!command) { return };

    try {
        await command.execute(interaction, session)
    } catch (error) {
        log('bot', 'An error occured:');
        console.log(error);
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

    const user = client.user;

    log('bot', 'Client is ready');
    log('followup', `Logged in as ${user.tag}`)
});

// Login
client.login(token)