const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a company')
		.addStringOption(option => 
			option.setName('name')
				.setDescription('Name of the company')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('shares')
				.setDescription('Number of shares to create')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('price')
				.setDescription('Price of each share')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('salary')
				.setDescription('Salary of each employee')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('profit-margin')
				.setDescription('Percentage of profit to take, 0-100. The rest is paid in salary to employees.')
				.setRequired(true)),
	async execute(interaction) {
		// Open message author's file
		var user = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`));

        // Create file in stockinfo for the stock, and if file already exists, tell user to pick another name
		if (fs.existsSync(`./stockinfo/${interaction.options.getString('name')}.json`)) {
			interaction.reply('Company already exists');
		}
		else if (Number(interaction.options.getInteger('shares'))*Number(interaction.options.getInteger('price')) > user['snowballs']) {
			interaction.reply('You don\'t have enough money to create this company. You need ' + String(Number(interaction.options.getInteger('shares'))*Number(interaction.options.getInteger('price')) - user['snowballs']) + ' snowballs.');
		}
		else {
			fs.writeFileSync(`./stockinfo/${interaction.options.getString('name')}.json`, JSON.stringify({
				name: interaction.options.getString('name'),
				shares: Number(interaction.options.getInteger('shares')),
				price: Number(interaction.options.getInteger('price')),
				salary: Number(interaction.options.getInteger('salary')),
				profitRate: Number(interaction.options.getInteger('profit-margin')/100),
				owner: interaction.user.id,
				shareholders: {}
			}));
			interaction.reply('Company created');
			
			var cost = Number(interaction.options.getInteger('shares')) * Number(interaction.options.getInteger('price'));

			user['snowballs'] -= cost;
			user['company'] = interaction.options.getString('name')

			// Write to file
			fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(user));
		}
    },
};