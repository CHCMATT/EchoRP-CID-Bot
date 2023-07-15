const startup = require('../startup.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'startup',
	description: 'Posts the embed to the specified channel',

	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id == '177088916250296320') {
			await startup.startUp(interaction.client);
			await interaction.reply({ content: `Successfully posted the embed to the <#${process.env.EMBED_CHANNEL_ID}> channel.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};