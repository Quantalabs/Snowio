const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Shut down a company')
        .addStringOption(option =>
            option.setName('company')
                .setDescription('Company to shut down')
                .setRequired(true)),
	async execute(interaction) {
        // Check if company exists
        var company = interaction.options.getString('company');
        try {
            var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${company}.json`, 'utf8'));
        }
        catch (err) {
            interaction.reply({content: 'Company does not exist', ephemeral: true});
            return;
        }

        // Check if user is owner of company
        if (companyinfo.owner != interaction.user.id) {
            interaction.reply({content: 'You are not the owner of '+company, ephemeral: true});
            return;
        }

        // Pay back all shareholders
        for (var i in companyinfo.shareholders) {
            var shareholder = companyinfo.shareholders[i].user
            var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${shareholder}.json`, 'utf8'));
            userinfo.money += i.shares * companyinfo.shareprice;
            fs.writeFileSync(`./userinfo/${shareholder}.json`, JSON.stringify(userinfo));
        }

        // Remove all users employed in company
        for (var i in companyinfo.employees) {
            var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${companyinfo.employees[i]}.json`, 'utf8'));
            userinfo.company = null;
            fs.writeFileSync(`./userinfo/${companyinfo.employees[i]}.json`, JSON.stringify(userinfo));
        }
        
        // Remove company
        fs.unlinkSync(`./stockinfo/${company}.json`);
        interaction.reply('You have shut down '+company);
    },
};