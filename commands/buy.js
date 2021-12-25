const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy shares of a company')
		.addStringOption(option => 
			option.setName('name')
				.setDescription('Name of the stock')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('shares')
				.setDescription('Number of shares to buy')
				.setRequired(true)),
	async execute(interaction) {
		// Check if company exists
        var company = interaction.options.getString('name');
        var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${company}.json`, 'utf8'));
        if (companyinfo == null) {
            interaction.reply('Company does not exist');
            return;
        }

        // Check No. of available shares
        var shares = interaction.options.getInteger('shares');
        if (shares > companyinfo.avaliableShares) {
            interaction.reply('There are only '+companyinfo.avaliableShares+' shares available, you can\'t buy '+shares+' shares');
            return;
        }

        // Check if user has enough snowballs
        var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
        if (userinfo.snowballs < companyinfo.price * shares) {
            interaction.reply('You don\'t have enough snowballs. You need '+(companyinfo.price * shares)+' snowballs to buy '+shares+' shares of '+company);
            return;
        }

        // Buy shares
        userinfo.snowballs -= companyinfo.price * shares;
        companyinfo.avaliableShares -= shares;
        companyinfo.shareholders[interaction.user.id] = {
            user: interaction.user.id,
            shares: shares
        }
        
        // Write to files
        fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));
        fs.writeFileSync(`./stockinfo/${company}.json`, JSON.stringify(companyinfo));
    },
};