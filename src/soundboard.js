const { MessageActionRow, MessageButton } = require('discord.js');
const sounds = require('../sounds.json');


function createButton(sound) {
    const button = new MessageButton();

    button.setLabel(sound.name);
    button.setStyle('primary');

    return button
}

export function soundboard() {
    const chosen_sounds = sounds.slice(0, 25);

    const rows = [];

    for (let i = 0; i < chosen_sounds.length; i+=5) {
        const row = new MessageActionRow();

        for (let j = i; j < i + 5; j++) {
            row.addComponents(createButton(chosen_sounds[j]));
        }

        rows.push(row);
    }

    return rows;
}