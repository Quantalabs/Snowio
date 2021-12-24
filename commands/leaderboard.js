const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the top players in the game, or the top players in a specific category')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Category to choose stats of, if not specified, view the players with the most Snowballs')
                .setRequired(false)
                .addChoice('hits', 'hits')
                .addChoice('misses', 'Misses')
                .addChoice('snowballs', 'snowballs')
                .addChoice('probability', 'probability')),
	async execute(interaction) {
        // Fetch all players
        var users = fs.readdirSync('./userinfo');
        var usersinfo = [];

        // If category option is not specified, sort by Snowballs
        var category = interaction.options.getString('category') || 'snowballs';

        // For each player, add their stats to the usersinfo array
        for (var i = 0; i < users.length; i++) {
            var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${users[i]}`, 'utf8'));
            
            // Get user's name, from their ID
            var username = await interaction.client.users.fetch(users[i].split('.')[0]);

            usersinfo.push({
                'user': username.username,
                'stats': userinfo[category]
            });
        }

        // Sort the array by the chosen category
        usersinfo.sort(function(a, b) {
            return Number(b.stats) - Number(a.stats);
        });

        // If category is probability, reverse the array
        if (category == 'probability') {
            usersinfo.reverse();
        }
        
        // Build embed
        var embed = {
            "title": `Top players in ${category}`,
            "description": "Top players in the game",
            "color": 0x3262a8,
            "fields": []
        };

        // Add each player's stats to the embed
        for (var i = 0; i < usersinfo.length; i++) {
            embed.fields.push({
                "name": `${i+1}. ${usersinfo[i].user}`,
                "value": String(usersinfo[i].stats),
                "inline": false
            });
        }

        // Send embed
        await interaction.reply({embeds: [embed]});
    },
};