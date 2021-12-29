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
	guildId = process.env.guildId;
	clientId = process.env.clientId;
	token = process.env.token;
}

//
// ========================================================
// Server Setup

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Check out our status page instead <a href="https://stats.uptimerobot.com/D63qNFoMYr/790166926">here</a>'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

//
// =============================================
// Bot Initialization

const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	// If the command isn't the start command, tell user to use /start if they do not have a file
	if (interaction.commandName !== 'start') {
		if (!fs.existsSync(`./userinfo/${interaction.user.id}.json`)) {
			interaction.reply({content: 'You must use the /start command first!', ephemeral: true});
			return;
		}
	}

	if (!command) await interaction.reply({content: 'That command does not exist!', ephemeral: true});

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.message.interaction.commandName == 'shop') {
		if (interaction.values.length === 0) {
			return interaction.reply({ content: 'You did not select an item!', ephemeral: true });
		}

		const selectedItem = interaction.values[0];

		if (selectedItem === 'machine') {
			var usersnowballs = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));

			if (usersnowballs['snowballs'] >= 75) {
				usersnowballs['snowballs'] -= 75;
				usersnowballs['items'].push('machine');
				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(usersnowballs));
				interaction.reply(`${interaction.user.username} bought a snowball machine!`);
			}
			else {
				interaction.reply(`${interaction.user.username} does not have enough snowballs (need 75 total snowballs)`);
			}
		}
		else if (selectedItem === 'fortress') {
			var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));

			if (userinfo['snowballs'] >= 50) {
				userinfo['snowballs'] -= 50;
				userinfo['items'].push('fortress');
				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));
				interaction.reply(`${interaction.user.username} bought a fortress!`);
			}
			else {
				interaction.reply(`${interaction.user.username} does not have enough snowballs (need 50 total snowballs)`);
			}
		}
	}
});

client.login(token);

process.on('SIGINT', function() {
  console.log('Interrupted');
  process.exit(0);
});