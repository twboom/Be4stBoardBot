const { createAudioResource, StreamType } = require('@discordjs/voice');
const { MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
const { log } = require('./utility.js');
const path = require('path');
const { createReadStream } = require('node:fs');


async function getSounds() {
    const response = await fetch('https://be4stboard.thijsboom.com/api/sounds.json');
    const sounds = await response.json();
    return sounds
};

// Create a soundboard
async function create(interaction, { useLocal, soundList }) {

    if (!useLocal) {
        soundList = await getSounds();
    };

    const selection = soundList.slice(0, 25);

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
async function play(interaction, { player, connection, useLocal, soundList }) {

    log('interaction', `User ${interaction.user.tag} pressed the button ${interaction.customId}`)

    if (player === undefined || connection === undefined) {
        await interaction.reply({
            content: 'The bot is not in a voice channel!',
            ephemeral: true
        })
        log('followup', 'Bot not in a voice channel')
        return
    };

    interaction.deferUpdate();

    const cache = path.join(process.cwd(), 'cache'); 
    let location;

    if (!useLocal) {
        soundList = await getSounds();
    };

    const sound = soundList.find(({ slug }) => slug === interaction.customId); 
    
    if (!useLocal) {
        const url = 'be4stboard.thijsboom.com';
        location = `https://${url}/${sound.path}`;
    } else {
        location = path.join(cache, `${sound.slug}.${sound.extension}`);
        location = createReadStream(location);
    };


    const resource = createAudioResource(location, {
        inputType: StreamType.Arbitrary,
    });
    connection.subscribe(player);
    await player.play(resource);

    log('followup', `Played sample '${sound.name}'`)

};

module.exports = {
    create,
    play
};
