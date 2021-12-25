const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quit')
		.setDescription('Quit job'),
	async execute(interaction) {
        // Check if user is owner of company they are employed in
        var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
        if (userinfo.company != null) {
            var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${userinfo.company}.json`, 'utf8'));
            if (companyinfo.owner == interaction.user.id) {
                interaction.reply({content: 'You are the owner of '+userinfo.company+', you can\'t quit. You must shut down the company.', ephemeral: true});
                return;
            }
        }
        // Remove user from company.employees
        var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${userinfo.company}.json`, 'utf8'));
        var index = companyinfo.employees.indexOf(interaction.user.id);
        if (index > -1) {
            companyinfo.employees.splice(index, 1);
            fs.writeFileSync(`./stockinfo/${userinfo.company}.json`, JSON.stringify(companyinfo));
        }

        // Quit job
        userinfo.company = null;
        fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));

        interaction.reply('You have quit your job');
    },
};