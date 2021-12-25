const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const talkedRecently = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('salary')
		.setDescription('Collect your salary (in snowballs, of course)'),
	async execute(interaction) {
        if (talkedRecently.has(interaction.user.id)) {
            interaction.reply("Wait a day before getting typing this again.");
            return;
		}
		// Open up message author's file and company stock file
        var user = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`));
        var company = JSON.parse(fs.readFileSync(`./stockinfo/${user.company}.json`));

        // Check if user is in company
        if (user.company == null) {
            interaction.reply('You are not in a company');
            return;
        }

        // Add salary to user
        user.snowballs += company.salary;
        fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(user));

        // Change company stock value
        company.price -= company.salary/company.shares;
        
        // Check if company is bankrupt
        if (company.price <= 0) {
            // Delete file
            fs.unlinkSync(`./stockinfo/${user.company}.json`);

            // Change user's company
            user.company = null;
            fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(user));
            interaction.reply('Your company has gone bankrupt. You are no longer employed.');
            return;
        }
        else {
            fs.writeFileSync(`./stockinfo/${user.company}.json`, JSON.stringify(company));
            interaction.reply('You have collected your salary of '+company.salary+' snowballs. You now have '+user.snowballs+' snowballs.');
        }

        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.id);
        }, 1000*60*60*24);
    },
};