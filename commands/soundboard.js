const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soundboard')
        .setDescription('Gives you the soundboard to play with!')
        .addSubcommand('create').setDescription('Creates a soundboard')
        .addSubcommand('delete').setDescription('Deletes a soundboard'),
    async execute(interaction) {
        await interaction.reply('This is the soundboard command!');
    }
}