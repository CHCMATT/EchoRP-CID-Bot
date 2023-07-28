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
			description: 'The name of the counter you are resetting',
			choices: [{ name: 'Search Warrants', value: 'search' }, { name: 'Subpoenas', value: 'subpoenas' }, { name: 'Calls Attended', value: 'calls' }, { name: 'Money Seized', value: 'money' }, { name: 'Guns Seized', value: 'guns' }, { name: 'Drugs Seized', value: 'drugs' }],
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		try {
			if (interaction.member._roles.includes(process.env.FULL_TIME_DET_ROLE_ID) || interaction.member._roles.includes(process.env.CID_TEAM_LEAD_ROLE_ID) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id == '177088916250296320') {

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
				if (counterName === "calls") {
					await dbCmds.resetValue("countCallsAttended");
					var newValue = await dbCmds.readValue("countCallsAttended");
					var fixedName = "Calls Attended";
				}
				await editEmbed.editEmbed(interaction.client);
				await interaction.reply({ content: `Successfully reset the value for the \`${fixedName}\` counter to \`${newValue}\`.`, ephemeral: true });

				await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send(`:warning: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) reset the value of the \`${fixedName}\` counter to \`${newValue}\`.`)
			}
			else {
				await interaction.reply({ content: `:x: You must have the \`Full Time Detective\` role or the \`Administrator\` permission to use this function.`, ephemeral: true });
			}
		} catch (error) {
			if (process.env.BOT_NAME == 'test') {
				console.error(error);
			} else {
				console.error(error);

				let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');;
				let fileParts = __filename.split(/[\\/]/);
				let fileName = fileParts[fileParts.length - 1];

				console.log(`Error occured at ${errTime} at file ${fileName}!`);

				let errorEmbed = [new EmbedBuilder()
					.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
					.setDescription(`\`\`\`${error.toString().slice(0, 2000)}\`\`\``)
					.setColor('B80600')
					.setFooter({ text: `${errTime}` })];

				await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
			}
		}
	},
};