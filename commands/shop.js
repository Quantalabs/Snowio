const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const talkedRecently = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Shop for items at the store'),
	async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .setMinValues(1)
                    .addOptions([
                        {
                            label: 'Snowball Machine',
                            description: 'Generates snowballs at a rate of 1 per 20 seconds, up to a maximum of 100 snowballs',
                            value: 'machine',
                        },
                        {
                            label: 'Snowball Gun',
                            description: 'Throw multiple snowballs at a time',
                            value: 'snowballgun',
                        },
                        {
                            label: 'Freezethrower',
                            description: 'Throw freeze balls at your enemy',
                            value: 'thrower',
                        },
                    ]),
            );

        await interaction.reply({ content: 'Select an item from the shop', components: [row] });
    },
};