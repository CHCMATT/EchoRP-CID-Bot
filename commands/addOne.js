const dbCmds = require('../dbCmds.js');
const editEmbed = require('../editEmbed.js');
const { PermissionsBitField } = require('discord.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports = {
	name: 'addone',
	description: 'Adds 1 to the specified counter',
	options: [
		{
			name: 'countername',
			description: 'The name of the counter you are adding to',
			choices: [{ name: 'Search Warrants', value: 'search' }, { name: 'Subpoenas', value: 'subpoenas' }, { name: 'Calls Attended', value: 'calls' }, { name: 'Money Seized', value: 'money' }, { name: 'Guns Seized', value: 'guns' }, { name: 'Drugs Seized', value: 'drugs' }],
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		if (interaction.member._roles.includes(process.env.CID_ROLE_ID) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			const counterName = interaction.options.getString('countername').toLowerCase();

			if (counterName === "search") {
				await dbCmds.addOne("countSearchWarrants");
				var newValue = await dbCmds.readValue("countSearchWarrants");
				var fixedName = "Search Warrants";
			}
			if (counterName === "subpoenas") {
				await dbCmds.addOne("countSubpoenas");
				var newValue = await dbCmds.readValue("countSubpoenas");
				var fixedName = "Subpoenas";
			}
			if (counterName === "money") {
				await dbCmds.addOne("countMoneySeized");
				var newValue = formatter.format(await dbCmds.readValue("countMoneySeized"));
				var fixedName = "Money Seized";
			}
			if (counterName === "guns") {
				await dbCmds.addOne("countGunsSeized");
				var newValue = await dbCmds.readValue("countGunsSeized");
				var fixedName = "Guns Seized";
			}
			if (counterName === "drugs") {
				await dbCmds.addOne("countDrugsSeized");
				var newValue = await dbCmds.readValue("countDrugsSeized");
				var fixedName = "Drugs Seized";
			}
			if (counterName === "calls") {
				await dbCmds.addOne("countCallsAttended");
				var newValue = await dbCmds.readValue("countCallsAttended");
				var fixedName = "Calls Attended";
			}
			await editEmbed.editEmbed(interaction.client);
			await interaction.reply({ content: `Successfully added \`1\` to the \`${fixedName}\` counter - the new total is \`${newValue}\`.`, ephemeral: true });

			await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send(`:warning: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) added \`1\` to the \`${fixedName}\` counter for a new total of \`${newValue}\`.`)
		}
		else {
			await interaction.reply({ content: `:x: You must have the \`CID\` role or have the \`Administrator\` permission to use this function.`, ephemeral: true });
		}
	},
};

