const dbCmds = require('./dbCmds.js');
const editEmbed = require('./editEmbed.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

function isValidUrl(string) {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}

module.exports.modalSubmit = async (interaction) => {
	try {
		const modalID = interaction.customId;
		switch (modalID) {
			case 'moneySeizedModal':
				const moneySeized = Math.abs(Number(interaction.fields.getTextInputValue('moneySeizedInput')));
				const moneyCaseNum = interaction.fields.getTextInputValue('moneyCaseNumInput');
				const moneyCaseFileLink = interaction.fields.getTextInputValue('moneyCaseFileLinkInput');
				if (isNaN(moneySeized)) { // validate quantity of money
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('moneySeizedInput')}\` is not a valid number, please be sure to only enter numbers (no $ or commas).`,
						ephemeral: true
					});
				} else if (isNaN(moneyCaseNum)) { // validate case number
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('moneyCaseNumInput')}\` is not a valid number, please be sure to only enter numbers (no # or letters).`,
						ephemeral: true
					});
				} else if (!isValidUrl(moneyCaseFileLink)) { // validate case file link
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('moneyCaseFileLinkInput')}\` is not a valid URL, please be sure to enter a URL including the \`http\:\/\/\` or \`https\:\/\/\` portion.`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countMoneySeized", moneySeized);
					const newTotal = formatter.format(await dbCmds.readValue("countMoneySeized"));
					editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${moneySeized}\` to the \`Money Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get('1061406583478833223').send({
						content: `:white_check_mark: \`${interaction.member.user.username}\` added \`${moneySeized}\` to the \`Money Seized\` counter for a new total of \`${newTotal}\`. The associated Report # is \`${moneyCaseNum}\` with Case File \`${moneyCaseFileLink}\`.`
					})
				}
				break;
			case 'gunsSeizedModal':
				const gunsSeized = Math.abs(Number(interaction.fields.getTextInputValue('gunsSeizedInput')));
				const gunsLocation = interaction.fields.getTextInputValue('gunsLocationInput');
				if (isNaN(gunsSeized)) { // validate quantity of guns
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('gunsSeizedInput')}\` is not a valid number, please be sure to only enter numbers (no $ or commas).`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countGunsSeized", gunsSeized);
					const newTotal = await dbCmds.readValue("countGunsSeized");
					editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${gunsSeized}\` to the \`Guns Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get('1061406583478833223').send({
						content: `:white_check_mark: \`${interaction.member.user.username}\` added \`${gunsSeized}\` to the \`Guns Seized\` counter for a new total of \`${newTotal}\`. The guns were seized from \`${gunsLocation}\`.`
					})
				}
				break;
			case 'drugsSeizedModal':
				const drugsSeized = Math.abs(Number(interaction.fields.getTextInputValue('drugsSeizedInput')));
				if (isNaN(drugsSeized)) { // validate quantity of guns
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('drugsSeizedInput')}\` is not a valid number, please be sure to only enter numbers (no $ or commas).`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countDrugsSeized", drugsSeized);
					const newTotal = await dbCmds.readValue("countDrugsSeized");
					editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${drugsSeized}\` to the \`Drugs Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get('1061406583478833223').send({
						content: `:white_check_mark: \`${interaction.member.user.username}\` added \`${drugsSeized}\` to the \`Drugs Seized\` counter for a new total of \`${newTotal}\`.`
					})
				}
				break;
			default:
				await interaction.reply({
					content: `I\'m not familiar with this modal type. Please tag @CHCMATT to fix this issue.`,
					ephemeral: true
				});
				console.log(`Error: Unrecognized modal ID: ${interaction.customId}`);
		}
	} catch (error) {
		console.log(`Error in modal popup!`);
		console.error(error);
	}
};