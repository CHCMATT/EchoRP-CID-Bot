const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const dbCmds = require('./dbCmds.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.editEmbed = async (client) => {

	let countSearchWarrants = await dbCmds.readValue("countSearchWarrants");
	let countSubpoenas = await dbCmds.readValue("countSubpoenas");
	let countMoneySeized = formatter.format(await dbCmds.readValue("countMoneySeized"));
	let countGunsSeized = await dbCmds.readValue("countGunsSeized");
	let countDrugsSeized = await dbCmds.readValue("countDrugsSeized");

	countSearchWarrants = countSearchWarrants.toString();
	countSubpoenas = countSubpoenas.toString();
	countMoneySeized = countMoneySeized.toString();
	countGunsSeized = countGunsSeized.toString();
	countDrugsSeized = countDrugsSeized.toString();

	const searchWarrantsEmbed = new EmbedBuilder()
		.setTitle('Amount of Search Warrants served:')
		.setDescription(countSearchWarrants)
		.setColor('#FCF4C9');

	const subpoenasEmbed = new EmbedBuilder()
		.setTitle('Amount of Subpoenas served:')
		.setDescription(countSubpoenas)
		.setColor('#FEE3E2');

	const moneySeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Money seized:')
		.setDescription(countMoneySeized)
		.setColor('#BBF3C0');

	const gunsSeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Guns seized:')
		.setDescription(countGunsSeized)
		.setColor('#F0C7EA');

	const drugsSeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Drugs seized:')
		.setDescription(countDrugsSeized)
		.setColor('#ABBFFF');

	const currEmbed = await dbCmds.readMsgId("embedMsg");

	const channel = await client.channels.fetch('1060775654867619901')
	const currMsg = await channel.messages.fetch(currEmbed);

	const btns = additionButtons();

	currMsg.edit({ embeds: [searchWarrantsEmbed, subpoenasEmbed, moneySeizedEmbed, gunsSeizedEmbed, drugsSeizedEmbed], components: [btns] });
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
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addGuns')
			.setLabel('Add Guns Seized')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addDrugs')
			.setLabel('Add Drugs Seized')
			.setStyle(ButtonStyle.Success)
	);
	return row;
}