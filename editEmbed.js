const dbCmds = require('./dbCmds.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.editEmbed = async (client) => {
	try {
		let countSearchWarrants = await dbCmds.readValue("countSearchWarrants");
		let countSubpoenas = await dbCmds.readValue("countSubpoenas");
		let countCallsAttended = await dbCmds.readValue("countCallsAttended");
		let countMoneySeized = formatter.format(await dbCmds.readValue("countMoneySeized"));
		let countGunsSeized = await dbCmds.readValue("countGunsSeized");
		let countDrugsSeized = await dbCmds.readValue("countDrugsSeized");

		countSearchWarrants = countSearchWarrants.toString();
		countSubpoenas = countSubpoenas.toString();
		countCallsAttended = countCallsAttended.toString();
		countMoneySeized = countMoneySeized.toString();
		countGunsSeized = countGunsSeized.toString();
		countDrugsSeized = countDrugsSeized.toString();

		// Color Palette: https://www.schemecolor.com/rainbow-pastels-color-scheme.php

		const searchWarrantsEmbed = new EmbedBuilder()
			.setTitle('Amount of Search Warrants served:')
			.setDescription(countSearchWarrants)
			.setColor('#FF9AA2');

		const subpoenasEmbed = new EmbedBuilder()
			.setTitle('Amount of Subpoenas served:')
			.setDescription(countSubpoenas)
			.setColor('#FFB7B2');

		const callsAttendedEmbed = new EmbedBuilder()
			.setTitle('Amount of Calls Attended:')
			.setDescription(countCallsAttended)
			.setColor('#FFDAC1');

		const moneySeizedEmbed = new EmbedBuilder()
			.setTitle('Amount of Money seized:')
			.setDescription(countMoneySeized)
			.setColor('#E2F0CB');

		const gunsSeizedEmbed = new EmbedBuilder()
			.setTitle('Amount of Guns seized:')
			.setDescription(countGunsSeized)
			.setColor('#B5EAD7');

		const drugsSeizedEmbed = new EmbedBuilder()
			.setTitle('Amount of Drugs seized:')
			.setDescription(countDrugsSeized)
			.setColor('#C7CEEA');

		const currEmbed = await dbCmds.readMsgId("embedMsg");

		const channel = await client.channels.fetch(process.env.EMBED_CHANNEL_ID)
		const currMsg = await channel.messages.fetch(currEmbed);

		const btnRows = addBtnRows();

		currMsg.edit({ embeds: [searchWarrantsEmbed, subpoenasEmbed, callsAttendedEmbed, moneySeizedEmbed, gunsSeizedEmbed, drugsSeizedEmbed], components: btnRows });
	} catch (error) {
		if (process.env.BOT_NAME == 'test') {
			console.error(error);
		} else {
			let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');;
			let fileParts = __filename.split(/[\\/]/);
			let fileName = fileParts[fileParts.length - 1];

			let errorEmbed = [new EmbedBuilder()
				.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
				.setDescription(`\`\`\`${error.toString().slice(0, 2000)}\`\`\``)
				.setColor('B80600')
				.setFooter({ text: `${errTime}` })];

			await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });

			console.log(`Error occured at ${errTime} at file ${fileName}!`);
			console.error(error);
		}
	}
};

function addBtnRows() {
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
	const rows = [row1, row2];
	return rows;
}