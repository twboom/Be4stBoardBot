const { createAudioResource } = require('@discordjs/voice');
const { MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch')

async function getSounds() {
    const response = await fetch('https://be4stboard.thijsboom.com/api/sounds.json');
    const sounds = await response.json();
    return sounds
};

// Create a soundboard
async function create(interaction) {

    const sounds = await getSounds();

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

};

// Play a sound
async function play(interaction, session) {

    interaction.deferUpdate();

    const sounds = await getSounds();

    const url = 'be4stboard.thijsboom.com';
    const sound = sounds.find(({ slug }) => slug === interaction.customId);

    if (session.player === undefined || session.connection === undefined) { return };

    console.log(interaction.customId)

    const location = `https://${url}/${sound.path}`;
    const resource = createAudioResource(location);
    session.connection.subscribe(session.player);
    session.player.play(resource);

};

module.exports = {
    create,
    play
};
