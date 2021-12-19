const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('throws')
		.setDescription('Throws a snowball')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target to throw the snowball at')
				.setRequired(true)),
	async execute(interaction) {
		var usersnowballs = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'))

		if (usersnowballs['snowballs'] > 0) {
			usersnowballs['snowballs'] -= 1;
			fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(usersnowballs));
			// Flip a coin
			var coin = Math.floor(Math.random() * 2);
			if (coin == 0) {
				interaction.reply(`${interaction.user.username} threw a snowball at ${interaction.options.getUser('target')} and succeeded!`);
				
				// Edit the user file for the target
				var target = interaction.options.getUser('target');
				var targetinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));

				targetinfo['hits'] = String(Number(targetinfo['hits']) + 1);

				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(targetinfo));
			} else {
				interaction.reply(`${interaction.user.username} threw a snowball at ${interaction.options.getUser('target')}, but failed!`);

				// Edit the user file for the target
				var targetinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));

				targetinfo['Misses'] = String(Number(targetinfo['hits']) + 1);

				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(targetinfo));
			}
		}
		else {
			interaction.reply(`${interaction.user.username} doesn't have any snowballs!`);
		}
	},
};