const dbCmds = require('../dbCmds.js');
const editEmbed = require('../editEmbed.js');
const { PermissionsBitField } = require('discord.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports = {
	name: 'resetvalue',
	description: 'Resets the value of the specified counter',
	options: [
		{
			name: 'countername',
			description: 'The name of the counter you are adding to',
			choices: [{ name: 'Search Warrants', value: 'search' }, { name: 'Subpoenas', value: 'subpoenas' }, { name: 'Money Seized', value: 'money' }, { name: 'Guns Seized', value: 'guns' }, { name: 'Drugs Seized', value: 'drugs' }],
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

			const counterName = interaction.options.getString('countername').toLowerCase();

			if (counterName === "search") {
				await dbCmds.resetValue("countSearchWarrants");
				var newValue = await dbCmds.readValue("countSearchWarrants");
				var fixedName = "Search Warrants";
			}
			if (counterName === "subpoenas") {
				await dbCmds.resetValue("countSubpoenas");
				var newValue = await dbCmds.readValue("countSubpoenas");
				var fixedName = "Subpoenas";
			}
			if (counterName === "money") {
				await dbCmds.resetValue("countMoneySeized");
				var newValue = formatter.format(await dbCmds.readValue("countMoneySeized"));
				var fixedName = "Money Seized";
			}
			if (counterName === "guns") {
				await dbCmds.resetValue("countGunsSeized");
				var newValue = await dbCmds.readValue("countGunsSeized");
				var fixedName = "Guns Seized";
			}
			if (counterName === "drugs") {
				await dbCmds.resetValue("countDrugsSeized");
				var newValue = await dbCmds.readValue("countDrugsSeized");
				var fixedName = "Drugs Seized";
			}
			await editEmbed.editEmbed(interaction.client);
			await interaction.reply({ content: `Successfully reset the value for the \`${fixedName}\` counter to \`${newValue}\`.`, ephemeral: true });

			await interaction.client.channels.cache.get('1061406583478833223').send(`:warning: \`${interaction.member.user.username}\` reset the value of the \`${fixedName}\` counter to \`${newValue}\`.`)
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};

