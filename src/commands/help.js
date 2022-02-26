const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { log } = require('../functions/utility.js');


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
                    .setURL('https://github.com/twboom/Be4stBoardBot/wiki/Commands')
                    .setDescription('')
                    .addField('**Commands:**', 'These commands are available for Be4stBoard')
                    .addFields([
                        {
                            name: '`soundboard create`',
                            value: 'Creates a soundboard'
                        },
                        {
                            name: '`help`',
                            value: 'Shows this message'
                        },
                        {
                            name: '`channel join`',
                            value: 'Joins a voice channel (channel option for selecting)'
                        },
                        {
                            name: '`channel leave`',
                            value: 'Leaves the current channel'
                        }
                    ])
                    .setFooter({
                        text: 'Click the title to go the the wiki page on GitHub!'
                    })
                    .setTimestamp()
            ],
            ephemeral: true
        },
        )
        log('followup', `Sent help to ${interaction.user.tag}`)
    },
};