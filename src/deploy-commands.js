const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config/authentication.json');
const { log } = require('./functions/utility.js');

log('bot', 'Deploying commands')

const commands = []; // Array for the commands

// Get the commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
log('followup', 'Got the command files')


// Add the commands to the array
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON());
};
log('followup', 'Added the commands to the command list')

// Deploy the commands
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => log('followup', 'Successfully registered application commands'))
	.catch(console.error);