const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Use an item')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item to use')
                .setRequired(true)
                .addChoice('Snowball Machine', 'machine')
                .addChoice('Fortress', 'fortress')),
	async execute(interaction) {
        // Find items user has
        var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
        var items = userinfo['items'];

        // If user uses snowball machine, then add +5 to snowball count every 60 seconds
        if (interaction.options.getString('item') == 'machine' && items.includes('machine')) {
            // Remove machine from user items
            var index = items.indexOf('machine');
            items.splice(index, 1);
            userinfo['items'] = items;
            fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));
            
            interaction.reply('You have started the snowball machine!');
            var x = 0
            const y = setInterval(() => {
                var usersnowballs = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'))
                usersnowballs['snowballs'] += 10;
                fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(usersnowballs));
                interaction.followUp({content: `You gained another 10 snowballs from their machine!`, ephemeral: true});
                x+=1;
                if (x >= 10) {
                    interaction.followUp({content: 'The snowball machine has stopped!', ephemeral: true});
                    clearInterval(y);
                }
            }, 60000);
        }
        else if (interaction.options.getString('item') == 'fortress' && items.includes('fortress')) {
            var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'))
            
            // Decrease probablity of getting a snowball by 10%
            userinfo["probability"] -= 0.1;
            // Round probability to 2 decimal places
            userinfo["probability"] = Math.round(userinfo["probability"] * 100) / 100;

            if (userinfo['probability'] <= 0) {
                userinfo["probability"] = 0
            }

            // Remove fortress from user's items
            var index = items.indexOf('fortress');
            items.splice(index, 1);
            userinfo['items'] = items;

            fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));

            interaction.reply(`${interaction.user.username} has used their fortress! They now have a ${String(Number(userinfo['probability'])*100)}% chance of getting hit!`);
        }
        else {
            interaction.reply({content: `You don't have that item!`, ephemeral: true});
        }
    },
};