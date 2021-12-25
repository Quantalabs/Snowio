const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apply')
		.setDescription('Apply to a company')
        .addStringOption(option => 
            option.setName('company')
                .setDescription('Company to apply to')
                .setRequired(true)),
	async execute(interaction) {
        // Check if company exists
        var company = interaction.getOption('company');
        var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${company}.json`, 'utf8'));
        if (companyinfo == null) {
            interaction.reply('Company does not exist');
            return;
        }

        // Check if user is already in company
        var userinfo = JSON.parse(fs.readFileSync(`./stockinfo/${interaction.user.id}.json`, 'utf8'));
        if (userinfo.company != null) {
            interaction.reply('You are already in a company');
            return;
        }

        // Add user to company
        userinfo.company = company;
        fs.writeFileSync(`./stockinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));

        interaction.reply('You have applied to '+company);
    },
};