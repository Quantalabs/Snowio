const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const talkedRecently = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Add to your snowball stockpile'),
	async execute(interaction) {
		if (talkedRecently.has(interaction.user.id)) {
            interaction.reply("Wait 30 seconds before getting typing this again.");
		} else {
			var usersnowballs = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'))

			// Add 1 to the user's snowball count
			usersnowballs['snowballs'] += 1;
			fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(usersnowballs));

			interaction.reply(`${interaction.user.username} collected a snowball!`);

			// Adds the user to the set so that they can't talk for a minute
			talkedRecently.add(interaction.user.id);
			setTimeout(() => {
			// Removes the user from the set after a minute
			talkedRecently.delete(interaction.user.id);
			}, 30000);
		}
	},
};