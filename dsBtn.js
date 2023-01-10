const dbCmds = require('./dbCmds.js');
const editEmbed = require('./editEmbed.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports.btnPressed = async (interaction) => {
	try {
		const buttonID = interaction.customId;
		switch (buttonID) {
			case 'addSW':
				await dbCmds.addOne("countSearchWarrants");
				const newSearchWarrantsTotal = await dbCmds.readValue("countSearchWarrants");
				await editEmbed.editEmbed(interaction.client);
				await interaction.reply({ content: `Successfully added \`1\` to the \`Search Warrants\` counter - the new total is \`${newSearchWarrantsTotal}\`.`, ephemeral: true});
				await interaction.client.channels.cache.get('1061406583478833223').send(`:white_check_mark: \`${interaction.member.user.username}\` added \`1\` to the \`Search Warrants\` counter for a new total of \`${newSearchWarrantsTotal}\`.`)
			break;
			case 'addSubpoenas':
				await dbCmds.addOne("countSubpoenas");
				const newSubpoenasTotal = await dbCmds.readValue("countSubpoenas");
				await editEmbed.editEmbed(interaction.client);
				await interaction.reply({ content: `Successfully added \`1\` to the \`Subpoenas\` counter - the new total is \`${newSubpoenasTotal}\`.`, ephemeral: true});
				await interaction.client.channels.cache.get('1061406583478833223').send(`:white_check_mark: \`${interaction.member.user.username}\` added \`1\` to the \`Subpoenas\` counter for a new total of \`${newSubpoenasTotal}\`.`)
			break;
			case 'addMoney':
				const modal = new ModalBuilder()
					.setCustomId('moneySeizedModal')
					.setTitle('Add a quantity of Money Seized');
				const moneySeizedInput = new TextInputBuilder()
					.setCustomId('moneySeizedInput')
					.setLabel("How much money did you seize?")
					.setStyle(TextInputStyle.Short)
					.setPlaceholder('100')
					.setRequired(true);
				const moneySeizedInputRow = new ActionRowBuilder().addComponents(moneySeizedInput);
				modal.addComponents(moneySeizedInputRow);
				await interaction.showModal(modal);
			break;
		default:
			await interaction.reply({content: `I\'m not familiar with this button press. Please tag @CHCMATT to fix this issue.`, ephemeral: true});
			console.log(`Error: Unrecognized button press: ${interaction.customId}`);
		}
	}
	catch (error) {
		console.log(`Error in button press!`);
		console.error(error);
	}
};