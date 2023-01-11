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
				const inputVal = Math.abs(Number(interaction.fields.getTextInputValue('moneySeizedInput')));
				const inputCaseNum = interaction.fields.getTextInputValue('caseNumInput');
				const inputCaseFileLink = interaction.fields.getTextInputValue('caseFileLinkInput');
				if (isNaN(inputVal)) { // validate quantity of money
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('moneySeizedInput')}\` is not a valid number, please be sure to only enter numbers (no $ or commas).`,
						ephemeral: true
					});
				} else if (isNaN(inputCaseNum)) { // validate case number
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('caseNumInput')}\` is not a valid number, please be sure to only enter numbers (no # or letters).`,
						ephemeral: true
					});
				} else if (!isValidUrl(inputCaseFileLink)) { // validate case file link
					await interaction.reply({
						content: `\`${interaction.fields.getTextInputValue('caseFileLinkInput')}\` is not a valid URL, please be sure to enter a URL including the \`http\:\/\/\` or \`https\:\/\/\` portion.`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countMoneySeized", inputVal);
					const newTotal = formatter.format(await dbCmds.readValue("countMoneySeized"));
					editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${inputVal}\` to the \`Money Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get('1061406583478833223').send({
						content: `:white_check_mark: \`${interaction.member.user.username}\` added \`${inputVal}\` to the \`Money Seized\` counter for a new total of \`${newTotal}\`. The associated Report # is \`${inputCaseNum}\` with Case File \`${inputCaseFileLink}\`.`
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