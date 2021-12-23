const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const talkedRecently = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Buy items from the shop'),
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
                            description: 'Generates snowballs at a rate of 10 per 60 seconds, up to a maximum of 100 snowballs',
                            value: 'machine',
                        },
                        {
                            label: 'Fortress',
                            description: 'Reduces the chance of getting a snowball by 10%',
                            value: 'fortress',
                        }
                    ]),
            );

        await interaction.reply({ content: 'Select an item from the shop', components: [row] });
    },
};