const { SlashCommandBuilder } = require('@discordjs/builders');
const { create } = require('../functions/soundboard.js');
const { log } = require('../functions/utility.js');

const command = new SlashCommandBuilder()
                    .setName('soundboard')
                    .setDescription('Gives you the soundboard to play with!')
                    .addSubcommand(subcmd => subcmd.setName('create').setDescription('Creates a soundboard'))

async function execute(interaction) {
    const operation = interaction.options.getSubcommand();

    switch (operation) {

        case 'create':
            log('followup', 'Creating soundboard')
            create(interaction);
            break;

    };
};

module.exports = {
    data: command,
    execute
};