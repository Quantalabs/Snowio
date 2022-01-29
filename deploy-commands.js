// Check if config file exists, and if it does, load it and get guildId, clientId, and token
const fs = require('fs');

if (fs.existsSync('./config.json')) {
	var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
	guildId = config.guildId;
	clientId = config.clientId;
	token = config.token;
}
else {
	// Use environment variables instead
	guildId = process.env.GUILD_ID;
	clientId = process.env.CLIENT_ID;
	token = process.env.TOKEN;
}

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();