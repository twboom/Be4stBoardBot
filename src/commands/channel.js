const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require("@discordjs/voice");
const { ChannelType } = require('discord-api-types/v9');
const { log } = require('../functions/utility.js');

const command = new SlashCommandBuilder()
                    .setName('channel')
                    .setDescription('Controls the connection to the voice channel')
                    .addSubcommand(subcmd => subcmd
                        .setName('join')
                        .setDescription('Join a voice channel')
                        .addChannelOption(option => option
                            .setName('channel')
                            .setDescription('The channel to join')
                            .setRequired(true)
                            .addChannelTypes([ChannelType.GuildVoice, ChannelType.GuildStageVoice])
                        )
                    )
                    .addSubcommand(subcmd => subcmd
                        .setName('leave')
                        .setDescription('Leave the current channel')
                    )

async function execute(interaction, session) {
    const operation = interaction.options.getSubcommand();

    let message;

    switch (operation) {
        case 'join':
            if (! await checkPermissions(interaction, 'channel-join')) { return };
            const channel = interaction.options.getChannel('channel');
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guildId,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            session.connection = connection;
            message = `Successfully joined ${channel.name}`;
            break;

        case 'leave':
            if (! await checkPermissions(interaction, 'channel-leave')) { return };
            if (session.connection === undefined) {
                message = 'There was no connection';
                return;
            };
            session.connection.destroy();
            session.connection = undefined;
            message = `Successfully left the channel`
            break;
    };

    await interaction.reply({
        content: message,
        ephemeral: true
    })

    log('followup', message)
    
};

module.exports = {
    data: command,
    execute
}
