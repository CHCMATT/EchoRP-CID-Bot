const moment = require('moment');
const dbCmds = require('./dbCmds.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.editEmbed = async (client) => {
	try {
		let now = Math.floor(new Date().getTime() / 1000.0);
		let today = `<t:${now}:d>`;

		let countSearchWarrants = await dbCmds.readValue("countSearchWarrants");
		let countSubpoenas = await dbCmds.readValue("countSubpoenas");
		let countCallsAttended = await dbCmds.readValue("countCallsAttended");
		let countMoneySeized = await dbCmds.readValue("countMoneySeized");
		let countGunsSeized = await dbCmds.readValue("countGunsSeized");
		let countDrugsSeized = await dbCmds.readValue("countDrugsSeized");

		// Color Palette: https://www.schemecolor.com/rainbow-pastels-color-scheme.php

		let mainFields = [];

		if (countSearchWarrants >= 1) {
			countSearchWarrants = countSearchWarrants.toString();
			mainFields.push({ name: `Search Warrants served: `, value: `${countSearchWarrants}` });
		}
		if (countSubpoenas >= 1) {
			countSubpoenas = countSubpoenas.toString();
			mainFields.push({ name: `Subpoenas served:`, value: `${countSubpoenas}` });
		}
		if (countCallsAttended >= 1) {
			countCallsAttended = countCallsAttended.toString();
			mainFields.push({ name: `Calls attended:`, value: `${countCallsAttended}` });
		}
		if (countMoneySeized >= 1) {
			countMoneySeized = formatter.format(countMoneySeized);
			mainFields.push({ name: `Money seized:`, value: `${countMoneySeized}` });
		}
		if (countGunsSeized >= 1) {
			countGunsSeized = countGunsSeized.toString();
			mainFields.push({ name: `Guns seized:`, value: `${countGunsSeized}` });
		}
		if (countDrugsSeized >= 1) {
			countDrugsSeized = countDrugsSeized.toString();
			mainFields.push({ name: `Drugs seized:`, value: `${countDrugsSeized}` });
		}

		let mainEmbed = new EmbedBuilder()
			.setTitle(`CID Statistics as of ${today}: `)
			.addFields(mainFields)
			.setColor('FFB7B2');

		const currEmbed = await dbCmds.readMsgId("embedMsg");

		const channel = await client.channels.fetch(process.env.EMBED_CHANNEL_ID)
		const currMsg = await channel.messages.fetch(currEmbed);

		const btnRows = addBtnRows();

		currMsg.edit({ embeds: [mainEmbed], components: btnRows });
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

function addBtnRows() {
	const row1 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('addToStatistics')
			.setLabel('Add to Statistics')
			.setStyle(ButtonStyle.Success)
	);
	const rows = [row1];
	return rows;
}