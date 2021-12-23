const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

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

	if (!command) return;

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

			if (usersnowballs['snowballs'] >= 20) {
				usersnowballs['snowballs'] -= 20;
				usersnowballs['items'].push('machine');
				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(usersnowballs));
				interaction.reply(`${interaction.user.username} bought a snowball machine!`);
			}
			else {
				interaction.reply(`${interaction.user.username} does not have enough snowballs (need 100 total snowballs)`);
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