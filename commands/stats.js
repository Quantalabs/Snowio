const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('View personal stats, or another player\'s stats')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to view stats of. If not specified, view your own stats')
                .setRequired(false)),
	async execute(interaction) {
        let user = interaction.options.getUser('target') || interaction.user;
        
        // Find user's stats
        var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${user.id}.json`, 'utf8'));
        var items = userinfo['items'];
        if (items.length == 0) {
            items = 'None';
        } else {
            items = "`"+items.join('`, `')+"`";
        }
        
        // Build embed
        var embed = {
            "title": `${user.username}'s stats`,
            "description": "Stats for " + user.username,
            "color": 0x3262a8,
            "fields": [
                {
                    "name": "# of Snowballs in Stockpile",
                    "value": String(userinfo['snowballs']),
                    "inline": true
                },
                {
                    "name": "Hits Thrown",
                    "value": userinfo['hits'],
                    "inline": true
                },
                {
                    "name": "Misses",
                    "value": userinfo['Misses'],
                    "inline": true
                },
                {
                    "name": "Hit Probability",
                    "value": String(userinfo['probability']),
                    "inline": true
                },
                {
                    "name": "Items",
                    "value": items,
                    "inline": true
                },
                {
                    "name": "Company",
                    "value": userinfo['company'] || 'None',
                }
            ]
        };
        // Send embed
        await interaction.reply({embeds: [embed]});
    },
};