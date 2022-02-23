const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes, ChannelType } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('../config.json');

const commands = [
	new SlashCommandBuilder()
		.setName('soundboard')
		.setDescription('Gives you the soundboard to play with!')
		.addSubcommand(subcmd => subcmd.setName('create').setDescription('Creates a soundboard'))
		.addSubcommand(subcmd => subcmd.setName('delete').setDescription('Deletes the soundboard'))
		.addSubcommand(subcmd => subcmd.setName('help').setDescription('Shows this message'))
		.addSubcommand(subcmd => subcmd.setName('join').setDescription('Joins the soundboard')
			.addChannelOption(option => option
				.setName('channel')
				.setDescription('The channel to join')
				.setRequired(true)
				.addChannelTypes([ChannelType.GuildVoice, ChannelType.GuildStageVoice])
			)
		)
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);