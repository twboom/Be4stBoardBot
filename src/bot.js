const fs = require('fs');
const { log, getPath } = require('./functions/utility.js')
const { Client, Collection, Intents } = require('discord.js');
const { token } = require(getPath('authentication'));
const { createAudioPlayer } = require('@discordjs/voice');
const { play } = require('./functions/soundboard.js');
const path = require('path');

// Create the client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
log('bot', 'Client created');

// Session storage
const session = {}

// Set the commands
log('bot', 'Loading commands')
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Add to the collection
    client.commands.set(command.data.name, command);
};
log('followup', 'All commands loaded')

function checkLocal() {
    const cwd = process.cwd();
    session.useLocal = true;
    log('bot', 'Checking local files')
    const cachePath = path.join(cwd, 'cache');
    const soundsPath = path.join(cachePath, 'sounds.json');
    if (fs.existsSync(cachePath) && fs.statSync(cachePath).isDirectory()) {
        if (fs.existsSync(cachePath + '/sounds.json') && fs.statSync(cachePath + '/sounds.json').isFile()) {
            const sounds = JSON.parse(fs.readFileSync(soundsPath));
            for (const sound of sounds) {
                soundPath = path.join(cachePath, `${sound.slug}.${sound.extension}`);
                if (fs.existsSync(soundPath) && fs.statSync(soundPath).isFile()) {
                } else {
                    log('followup', `${sound.slug}.${sound.extension} not found`);
                    session.useLocal = false;
                };
            };
        } else {
            log('followup', 'No local files');
            session.useLocal = false;
        }
    } else {
        log('followup', 'No local files');
        session.useLocal = false;
    };
    
    if (!session.useLocal) {
        session.useLocal = false;
        log('warning', 'No local files found or not complete');
        log('followup', 'Consider dowloading the files with `be4stboard download-files`');
        log('followup', 'Now using online files');
    } else {
        log('followup', 'All files found');
        log('followup', 'Using local files');
    };

};

checkLocal();

// Load the sounds.json if using local files
if (session.useLocal) {
    const cwd = process.cwd();
    const cachePath = path.join(cwd, 'cache');
    const soundsPath = path.join(cachePath, 'sounds.json');
    const sounds = JSON.parse(fs.readFileSync(soundsPath));
    session.soundList = sounds;
};

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