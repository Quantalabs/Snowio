const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('throws')
		.setDescription('Throw a snowball at a target')
		.addUserOption(option =>
			option.setName('target')
				.setDescription('The target to throw the snowball at')
				.setRequired(true)),
	async execute(interaction) {
		var usersnowballs = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'))

		if (usersnowballs['snowballs'] > 0) {
			usersnowballs['snowballs'] -= 1;
			fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(usersnowballs));
			// Flip a 100 sided probability coin
			var coin = Math.random()*100;
			if (coin <= JSON.parse(fs.readFileSync(`./userinfo/${interaction.options.getUser('target').id}.json`, 'utf8'))['probability']*100) {
				// Edit target user's file
				var targetinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.options.getUser('target').id}.json`, 'utf8'));
				
				// Decrease target's snowball count by 10, but if value is less than 0, set it to 0
				targetinfo['snowballs'] -= 10;
				if (targetinfo['snowballs'] < 0) {
					targetinfo['snowballs'] = 0;
				}

				// Increase target's hit probability by 2%, or set it to 90% if it goes over 90%.
				targetinfo['probability'] += 0.02;
				targetinfo['probability'] = Math.round(targetinfo['probability'] * 100) / 100;
				if (targetinfo['probability'] > 0.9) {
					targetinfo['probability'] = 0.9;
				}

				fs.writeFileSync(`./userinfo/${interaction.options.getUser('target').id}.json`, JSON.stringify(targetinfo));

				interaction.reply(`${interaction.user.username} has thrown a snowball at ${interaction.options.getUser('target').username} and has successfully hit them!`);
				
				// Add 1 to sender's hit count
				var senderinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
				senderinfo['hits'] = String(Number(senderinfo['hits'])+1);
				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(senderinfo));
			} else {
				interaction.reply(`${interaction.user.username} threw a snowball at ${interaction.options.getUser('target')}, but failed, and so gave them 1 free snowball!`);

				// Add 1 to sender's miss count
				var senderinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
				senderinfo['Misses'] = String(Number(senderinfo['Misses'])+1);
				fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(senderinfo));

				// Add 1 to target's snowball count
				var targetinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.options.getUser('target').id}.json`, 'utf8'));
				targetinfo['snowballs'] += 1;

				// Increase target's hit probability by 1%
				targetinfo['probability'] += 0.01;
				// Round probability to 2 decimal places
				targetinfo['probability'] = Math.round(targetinfo['probability'] * 100) / 100;

				fs.writeFileSync(`./userinfo/${interaction.options.getUser('target').id}.json`, JSON.stringify(targetinfo));
			}
		}
		else {
			interaction.reply({content: `${interaction.user.username} doesn't have any snowballs!`, ephemeral: true});
		}
	},
};