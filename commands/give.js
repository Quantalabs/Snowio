const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give user snowballs')
		.addUserOption(option =>
            option.setName('user')
                .setDescription('User to give snowballs to.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of snowballs to give.')
                .setRequired(true)),
	async execute(interaction) {
        // Open up message author's file and user's file
        var user = JSON.parse(fs.readFileSync(`./userinfo/${interaction.user.id}.json`));
        var target = JSON.parse(fs.readFileSync(`./userinfo/${interaction.options.getUser('user').id}.json`));

        // Check if user has enough snowballs
        if (user['snowballs'] < interaction.options.getInteger('amount')) {
            interaction.reply({content: 'You don\'t have enough snowballs', ephemeral: true});
            return;
        }

        // Give user snowballs
        user['snowballs'] -= interaction.options.getInteger('amount');
        target['snowballs'] += interaction.options.getInteger('amount');

        // Write to files
        fs.writeFileSync(`./userinfo/${interaction.user.id}.json`, JSON.stringify(user));
        fs.writeFileSync(`./userinfo/${interaction.options.getUser('user').id}.json`, JSON.stringify(target));

        interaction.reply('Snowballs given');
    },
};