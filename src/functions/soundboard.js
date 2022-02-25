const { createAudioResource } = require('@discordjs/voice');
const { MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const { log } = require('./utility.js');
const path = require('path');

async function getSounds() {
    const response = await fetch('https://be4stboard.thijsboom.com/api/sounds.json');
    const sounds = await response.json();
    return sounds
};

// Create a soundboard
async function create(interaction, { useLocal }) {

    let sounds;

    if (useLocal) {
        const cache = path.join(process.cwd(), 'cache');
        sounds = require(path.join(cache, 'sounds.json'));
    } else {
        sounds = await getSounds();
    };

    const selection = sounds.slice(0, 25);

    let components = [];

    for (let i = 0; i < selection.length; i += 5) {
        const row = new MessageActionRow();

        let buttons = [];

        for (let j = i; j < i + 5; j++) {
            const sound = selection[j]
            buttons.push(
                new MessageButton()
                    .setLabel(sound.name)
                    .setCustomId(sound.slug)
                    .setStyle('PRIMARY')
            )
        };
    
        row.addComponents(buttons);

        components.push(row)
    };

    

    await interaction.reply({
        content: 'Be4stBoard',
        components: components,
    })

    log('followup', 'Soundboard created')

};

// Play a sound
async function play(interaction, session) {

    log('interaction', `User ${interaction.user.tag} pressed the button ${interaction.customId}`)

    if (session.player === undefined || session.connection === undefined) {
        await interaction.reply({
            content: 'The bot is not in a voice channel!',
            ephemeral: true
        })
        log('followup', 'Bot not in a voice channel')
        return
    };

    interaction.deferUpdate();

    const sounds = await getSounds();

    const url = 'be4stboard.thijsboom.com';
    const sound = sounds.find(({ slug }) => slug === interaction.customId);   

    const location = `https://${url}/${sound.path}`;
    const resource = createAudioResource(location);
    session.connection.subscribe(session.player);
    session.player.play(resource);

    log('followup', `Played sample '${sound.name}'`)

};

module.exports = {
    create,
    play
};
