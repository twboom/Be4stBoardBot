const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows help message'),
    async execute(interaction) {
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#7B0504')
                    .setTitle('Be4stBoard Help')
                    .setDescription('Be4stBoard help menu')
                    .addFields([
                        {
                            name: '`soundboard create`',
                            value: 'Creates a soundboard'
                        },
                        {
                            name: '`soundboard delete`',
                            value: 'Deletes a soundboard',
                        },
                        {
                            name: '`help`',
                            value: 'Shows this message'
                        }
                    ])
            ]
        })
    }
};