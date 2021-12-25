const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewstock')
		.setDescription('View stocks'),
	async execute(interaction) {
        // Fetch all stocks
        var stocks = fs.readdirSync('./stockinfo');
        var stocksinfo = [];

        // For each stock, add their stats to the stockinfo array
        for (var i = 0; i < stocks.length; i++) {
            var stockinfo = JSON.parse(fs.readFileSync(`./stockinfo/${stocks[i]}`, 'utf8'));
            
            stocksinfo.push({
                'stock': stocks[i].split('.')[0],
                'stats': stockinfo
            });
        }

        // Sort array by price
        stocksinfo.sort(function(a, b) {
            return Number(b.stats.price) - Number(a.stats.price);
        })

        // Build embed
        var embed = {
            "title": `Top stocks`,
            "description": "Top stocks in the game",
            "color": 0x3262a8,
            "fields": []
        };

        // Add each stock's stats to the embed
        for (var i = 0; i < stocksinfo.length; i++) {
            embed.fields.push({
                "name": `${i+1}. ${stocksinfo[i].stock}`,
                "value": "Price: "+String(stocksinfo[i].stats.price),
                "inline": false
            });
        }

        // Send embed
        interaction.reply({embeds: [embed]});
    },
};