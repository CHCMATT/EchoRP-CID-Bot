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
	let countCallsAttended = await dbCmds.readValue("countCallsAttended");

	countSearchWarrants = countSearchWarrants.toString();
	countSubpoenas = countSubpoenas.toString();
	countMoneySeized = countMoneySeized.toString();
	countGunsSeized = countGunsSeized.toString();
	countDrugsSeized = countDrugsSeized.toString();
	countCallsAttended = countCallsAttended.toString();

	// Color Palette: https://www.schemecolor.com/rainbow-pastels-color-scheme.php

	const searchWarrantsEmbed = new EmbedBuilder()
		.setTitle('Amount of Search Warrants served:')
		.setDescription(countSearchWarrants)
		.setColor('#FF9AA2');

	const subpoenasEmbed = new EmbedBuilder()
		.setTitle('Amount of Subpoenas served:')
		.setDescription(countSubpoenas)
		.setColor('#FFB7B2');

	const moneySeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Money seized:')
		.setDescription(countMoneySeized)
		.setColor('#FFDAC1');

	const gunsSeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Guns seized:')
		.setDescription(countGunsSeized)
		.setColor('#E2F0CB');

	const drugsSeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Drugs seized:')
		.setDescription(countDrugsSeized)
		.setColor('#B5EAD7');

	const callsAttendedEmbed = new EmbedBuilder()
		.setTitle('Amount of Calls Attended:')
		.setDescription(countCallsAttended)
		.setColor('#C7CEEA');

	const currEmbed = await dbCmds.readMsgId("embedMsg");

	const channel = await client.channels.fetch('1060775654867619901')
	const currMsg = await channel.messages.fetch(currEmbed);

	const btnRow1 = addBtnRow1();
	const btnRow2 = addBtnRow2();

	currMsg.edit({ embeds: [searchWarrantsEmbed, subpoenasEmbed, moneySeizedEmbed, gunsSeizedEmbed, drugsSeizedEmbed, callsAttendedEmbed], components: [btnRow1, btnRow2] });
};

function addBtnRow1() {
	const row1 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addSW')
			.setLabel('Add a Search Warrant')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addSubpoenas')
			.setLabel('Add a Subpoena')
			.setStyle(ButtonStyle.Success),

		new ButtonBuilder()
			.setCustomId('addCall')
			.setLabel('Add a Call Attended')
			.setStyle(ButtonStyle.Success)
	);
	return row1;
}

function addBtnRow2() {
	const row2 = new ActionRowBuilder().addComponents(
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
	return row2;
}