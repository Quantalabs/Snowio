const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell shares of a company')
		.addStringOption(option => 
			option.setName('name')
				.setDescription('Name of the company')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('shares')
				.setDescription('Number of shares to sell')
				.setRequired(true)),
	async execute(interaction) {
		// Check if company exists
        var company = interaction.options.getString('name');
        var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${company}.json`, 'utf8'));
        if (companyinfo != null) {
            interaction.reply('Company already exists');
            return;
        }

		// Check if user has the no. of shares specified
		var shares = interaction.options.getInteger('shares');
		var userstock = JSON.parse(fs.readFileSync(`./stockinfo/${company}.json`, 'utf8')).shareholders[interaction.user.id];
		if (userstock == null || userstock.shares < shares) {
			interaction.reply('You don\'t have '+shares+' shares of '+company);
			return;
		}

		// Sell shares
		var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
		userinfo.snowballs += companyinfo.price * shares;
		companyinfo.avaliableShares += shares;	
		
		// If user has no more shares of company, remove them from the company
		if (companyinfo.shareholders[interaction.user.id].shares == shares) {
			delete companyinfo.shareholders[interaction.user.id];
		} else {
			companyinfo.shareholders[interaction.user.id].shares -= shares;
		}

		// Write to files
		fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));
		fs.writeFileSync(`./stockinfo/${company}.json`, JSON.stringify(companyinfo));
    },
};