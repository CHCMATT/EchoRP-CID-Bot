const dbCmds = require('./dbCmds.js');
const editEmbed = require('./editEmbed.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.modalSubmit = async (interaction, client) => {
	try {
		const modalID = interaction.customId;
		switch (modalID) {
			case 'moneySeizedModal':
				const inputVal = Math.abs(Number(interaction.fields.getTextInputValue('moneySeizedInput')));
				if (!isNaN(inputVal))
				{
					await dbCmds.addValue("countMoneySeized", inputVal);
					const newTotal = formatter.format(await dbCmds.readValue("countMoneySeized"));
					editEmbed.editEmbed(interaction.client);
					await interaction.reply({ content: `Successfully added \`${inputVal}\` to the \`Money Seized\` counter - the new total is \`${newTotal}\`.`, ephemeral: true});
					await interaction.client.channels.cache.get('1061406583478833223').send(`:white_check_mark: \`${interaction.member.user.username}\` added \`${inputVal}\` to the \`Money Seized\` counter for a new total of \`${newTotal}\`.`)
				}
				else {
					await interaction.reply({ content: `\`${interaction.fields.getTextInputValue('moneySeizedInput')}\` is not a valid number, please be sure to only enter numbers (no $ or commas).`, ephemeral: true});
				}
			break;
		default:
			await interaction.reply({content: `I\'m not familiar with this modal type. Please tag @CHCMATT to fix this issue.`, ephemeral: true});
			console.log(`Error: Unrecognized modal ID: ${interaction.customId}`);
		}
	}
	catch (error) {
		console.log(`Error in modal popup!`);
		console.error(error);
	}
};