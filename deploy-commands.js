const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config/validation.json');

const commands = []; // Array for the commands

// Get the commands
const commandFiles = fs.readFileSync('./commands').filter(file => file.endsWith('js'));

// Add the commands to the array
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    command.push(command.data.toJSON());
};


// Deploy the commands
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommand(clientId, guildId), { body: commands })
    .then(_ => console.log('Successfully registered application commands'))
    .catch(console.error)