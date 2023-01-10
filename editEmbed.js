const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const dbCmds = require('./dbCmds.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.editEmbed = async (client) => {
	const btns = additionButtons();

	let countSearchWarrants = await dbCmds.readValue("countSearchWarrants");
	let countSubpoenas = await dbCmds.readValue("countSubpoenas");
	let countMoneySeized = formatter.format(await dbCmds.readValue("countMoneySeized"));

	countSearchWarrants = countSearchWarrants.toString();
	countSubpoenas = countSubpoenas.toString();
	countMoneySeized = countMoneySeized.toString();

	const searchWarrantsEmbed = new EmbedBuilder()
	.setTitle('Amount of Search Warrants served:')
	.setDescription(countSearchWarrants)
	.setColor('#6DBFD1');

	const subpoenasEmbed = new EmbedBuilder()
	.setTitle('Amount of Subpoenas served:')
	.setDescription(countSubpoenas)
	.setColor('#FF7D63');

	const moneySeizedEmbed = new EmbedBuilder()
	.setTitle('Amount of Money Seized:')
	.setDescription(countMoneySeized)
	.setColor('#57C478');

	const currEmbed = await dbCmds.readMsgId("embedMsg");

	const channel = await client.channels.fetch('1060775654867619901')
	const currMsg = await channel.messages.fetch(currEmbed);

	currMsg.edit({ embeds: [searchWarrantsEmbed, subpoenasEmbed, moneySeizedEmbed], components: [btns]});
};

function additionButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addSW')
			.setLabel('Add a Search Warrant')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addSubpoenas')
			.setLabel('Add a Subpoena')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addMoney')
			.setLabel('Add Money Seized')
			.setStyle(ButtonStyle.Success)
	);
	return row;
}