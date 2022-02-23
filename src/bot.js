// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, StreamType, generateDependencyReport } = require('@discordjs/voice');
const { join } = require('path');

const sounds = require('../sounds.json');

const session = {
    'soundboard': undefined,
};

function playSound(sound) {
    if (session.player === undefined) { return };

    sound = sounds.find(s => s.slug === sound);

    sound.path = `./sounds/${sound.slug}.mp3`;

    sound.path = join(__dirname, sound.path);

    const resource = createAudioResource(sound.path, {
        inputType: StreamType.Arbitrary
    });

    session.connection.subscribe(session.player)

    session.player.play(resource);

    console.log(`   [->] Played ${sound.name}`);
    
}

function createButton(sound) {
    const button = new MessageButton()
				    .setCustomId(sound.slug)
					.setLabel(sound.name)
					.setStyle('PRIMARY')

    return button
}

function createSoundboard() {

    const chosen_sounds = sounds.slice(0, 25);

    const rows = [];

    for (let i = 0; i < chosen_sounds.length; i+=5) {
        const row = new MessageActionRow();

        let buttons = []

        for (let j = i; j < i + 5; j++) {
            buttons.push(createButton(chosen_sounds[j]));
        }

        row.addComponents(buttons);

        rows.push(row);
    }

    return rows;
}


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

function getUser(interaction) {
    return `${interaction.user.username}#${interaction.user.discriminator}`;
}

function getToken() {
    const args = process.argv;
    const index = args.indexOf('-t');
    if (index === -1) {
        return null;
    }
    return args[index + 1];
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    // Create audio player
    const player = createAudioPlayer();
    session.player = player;
    
    console.log('Ready!');
});

// Respond to commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) { return };

    const now = getTime();

    const { commandName } = interaction;

    if (commandName === 'soundboard') {
        let  operation = interaction.options.getSubcommand();

        if (operation === null) { operation = 'help' };

        console.log(`[*] [${now}] User ${getUser(interaction)} ran command ${commandName} with operation ${operation}`);
        
        if (operation === 'create') { // If user wants to create a soundboard
            if (session.soundboard === undefined) {
                const components = createSoundboard();
    
                await interaction.reply({
                    content: 'Be4stBoard',
                    components: components,
                })

                console.log('   [->] Soundboard created');
    
                session.soundboard = interaction;
            } else {
                console.log('   [->] Soundboard already created');
                await interaction.reply({
                    content: 'The soundboard is already created',
                    ephemeral: true,
                });
            }
        } else if (operation === 'delete') { // If user wants to delete the soundboard
            if (session.soundboard !== undefined) {
                await session.soundboard.deleteReply()
                session.soundboard = undefined;
                await interaction.reply({
                    content: 'The soundboard has been deleted',
                    ephemeral: true,
                });
                console.log('   [->] Soundboard deleted');
            } else {
                await interaction.reply({
                    content: 'The soundboard does not exist',
                    ephemeral: true,
                });
                console.log('   [->] Soundboard does not exist');
            }

            // Leave voice channel
            if (session.connection !== undefined) {
                await session.connection.destroy();
                session.connection = undefined;
                console.log('   [->] Left voice channel');
            };
        } else if (operation === 'help') {
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#7B0504')
                        .setTitle('Be4stBoard Help')
                        .addFields([
                            {name: 'Commands', value: '`soundboard create` - Creates a soundboard\n`soundboard delete` - Deletes the soundboard\n`sounboard help` (default) - Show this message'},
                        ])
                ],
                ephemeral: true,
            });
            console.log('   [->] Help message sent');
        } else if (operation === 'join') {
            const channel = interaction.options.getChannel('channel');
            if (channel.isVoice()) {
                await interaction.reply({
                    content: `Joining ${channel.name}`,
                    ephemeral: true,
                });
                console.log(`   [->] Joining ${channel.name}`);
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guildId,
                    adapterCreator: channel.guild.voiceAdapterCreator
                });
                connection.on(VoiceConnectionStatus.Ready, _ => {
                    console.log('   [->] Joined voice channel');
                })
                session.connection = connection;
            } else {
                await interaction.reply({
                    content: 'This is not a voice channel',
                    ephemeral: true,
                });
            }
        } else {
            await interaction.reply({
                content: 'Invalid operation',
                ephemeral: true,
            })
            console.log('   [->] Invalid operation');
        }
    }
});


// Respond to buttons
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) { return };
    
    const sound = interaction.customId;

    const now = getTime();

    console.log(`[*] [${now}] User ${getUser(interaction)} pressed the button "${sound}"`);

    await interaction.deferUpdate();

    playSound(sound);
});

// Start the bot
function main() {

    console.log(generateDependencyReport())

    // Get the token from the command line
    const token = getToken();

    // Throw an error if the token is not present
    if (!token) {
        console.error('No token provided');
        return;
    };

    // Login to Discord with your client's token
    client.login(token);
};

main();