const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Create a profile for yourself to start using the bot!'),
	async execute(interaction) {
        // Create userinfo file, if it doesn't exist, or if it does, delete it and start over
        if (fs.existsSync(`./userinfo/${interaction.user.id}.json`)) {
            fs.unlinkSync(`./userinfo/${interaction.user.id}.json`);
        }
        // Create userinfo file
        fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify({
            snowballs: 50,
            hits: "0",
            Misses: "0",
            items: [],
            probability: 0.5
        }));

        interaction.reply(`${interaction.user.username} has created a profile! You now have 50 snowballs and a 50% hit probability! Every time someone hits you, you can lose up to 10 snowballs. You can also buy items from the shop (/shop) that will generate snowballs for you, lower the chance of getting hit, or other cool stuff, and use them with /use! All stats are recorded, and you can view them view the /stats command. You can also use /start to completely reset your profile, if you want to start over. Good luck!`);
    },
};