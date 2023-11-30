const moment = require('moment');
const dbCmds = require('./dbCmds.js');
const editEmbed = require('./editEmbed.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports.btnPressed = async (interaction) => {
	try {
		const buttonID = interaction.customId;
		switch (buttonID) {
			case 'addToStatistics':
				if (interaction.member._roles.includes(process.env.CID_ROLE_ID) || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
					let addToStatisticsDropdown = new StringSelectMenuBuilder()
						.setCustomId('addToStatisticsDropdown')
						.setPlaceholder('Select an item to add')
						.addOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel('Search Warrants served')
								.setEmoji('📄')
								.setValue('searchWarrantsServed'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Subpoenas served')
								.setEmoji('📃')
								.setValue('subpoenasServed'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Calls attended')
								.setEmoji('📞')
								.setValue('callsAttended'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Money seized')
								.setEmoji('💰')
								.setValue('moneySeized'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Guns seized')
								.setEmoji('🔫')
								.setValue('gunsSeized'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Drugs seized')
								.setEmoji('💊')
								.setValue('drugsSeized'),
						);

					let addToStatisticsDropdownSelection = new ActionRowBuilder()
						.addComponents(addToStatisticsDropdown);

					await interaction.reply({ content: `What **statistic** would you like to add to?`, components: [addToStatisticsDropdownSelection], ephemeral: true });
				} else {
					await interaction.reply({ content: `:x: You must have the \`CID\` role or the \`Administrator\` permission to use this function.`, ephemeral: true });
				}
				break;
			default:
				await interaction.reply({ content: `I'm not familiar with this button press. Please tag @CHCMATT to fix this issue.`, ephemeral: true });
				console.log(`Error: Unrecognized button press: ${interaction.customId}`);
		}
	} catch (error) {
		if (process.env.BOT_NAME == 'test') {
			console.error(error);
		} else {
			console.error(error);

			let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');
			let fileParts = __filename.split(/[\\/]/);
			let fileName = fileParts[fileParts.length - 1];

			console.log(`An error occured at ${errTime} at file ${fileName}!`);

			let errString = error.toString();

			if (errString === 'Error: The service is currently unavailable.') {
				try {
					await interaction.editReply({ content: `⚠ A service provider we use has had a temporary outage. Please try to submit your request again.`, ephemeral: true });
				} catch {
					await interaction.reply({ content: `⚠ A service provider we use has had a temporary outage. Please try to submit your request again.`, ephemeral: true });
				}
			}

			let errorEmbed = [new EmbedBuilder()
				.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
				.setDescription(`\`\`\`${errString}\`\`\``)
				.setColor('B80600')
				.setFooter({ text: `${errTime}` })];

			await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
		}
	}
};