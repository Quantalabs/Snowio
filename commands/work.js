const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const talkedRecently = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work for your employer'),
	async execute(interaction) {
		// Check if user is in a company
        var userinfo = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`, 'utf8'));
        if (userinfo.company == null) {
            interaction.reply('You are not in a company. Use /apply to apply to a company');
            return;
        }

        var workMessages = [
            'You worked hard and earned some money. Congrats on your ',
            'Wow. You can work? That\'s amazing. You earned ',
            'What is this dark magic. You pulled snow out of the sky. Congrats on your ',
            'Wait a minute. You just created clouds in the sky. And then it started snowing... in the middle of the desert in summer. You earned ',
            'WOAH! You created a... snow tornado. What the heck? You got ',
            'Im getting bored. Take ',
            'You just worked. Nothing special. Why do you expect something weird to happen? You get ',
            'You worked hard. You earned ',
            'Your boss is lazy and so you managed to make a cool snow machine to boost productivity in the factory and you earned ',
            'You found a special snowflake that regenerates and earned '
        ]

        var workMessage = workMessages[Math.floor(Math.random() * workMessages.length)];
        var companyinfo = JSON.parse(fs.readFileSync(`./stockinfo/${userinfo.company}.json`, 'utf8'));
        
        // Make daily pay a random number between 1 and 30, subtracted from that number multiplied by the company's profit rate.
        var dailyPay = Math.floor(Math.random() * 30) + 1;
        var compProfit = dailyPay*companyinfo.profitRate;
        dailyPay -= dailyPay * companyinfo.profitRate;

        // If dailyPay and compProfit are both non-Integer, round dailyPay up to the nearest integer and round compProfit down to the nearest integer.
        if (dailyPay % 1 != 0 && compProfit % 1 != 0) {
            dailyPay = Math.ceil(dailyPay);
            compProfit = Math.floor(compProfit);
        }

        
        // Add money to company and user
        companyinfo.price = companyinfo.price + (compProfit/companyinfo.shares);
        userinfo.snowballs = userinfo.snowballs + dailyPay;

        // Write to files
        fs.writeFileSync(`./stockinfo/${userinfo.company}.json`, JSON.stringify(companyinfo));
        fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(userinfo));

        // Send message
        interaction.reply(workMessage + String(dailyPay) + ' snowballs.');

        // Add user to talkedRecently
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.id);
        }, 30000); // 30 second cool down
    },
};