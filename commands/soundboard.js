const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soundboard')
        .setDescription('Gives you the soundboard to play with!')
        .addSubcommand(subcmd => subcmd.setName('create').setDescription('Creates a soundboard'))
        .addSubcommand(subcmd => subcmd.setName('delete').setDescription('Deletes a soundboard')),
    async execute(interaction) {
        await interaction.reply('This is the soundboard command!');
    }
};