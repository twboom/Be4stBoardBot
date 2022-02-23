const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create the client
const client = new Client({
    intens: [Intents.FLAGS.GUILDS]
});

// Set the commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Add to the collection
    client.commands.set(command.data.name, command);
};

// Execute if command gets run
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) { return };

    const command = client.commands.get(interaction.commandName);

    if (!command) { return };

    try {
        await command.execute(interaction)
    } catch (error) {
        console.log(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    };
});