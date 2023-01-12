const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const dbCmds = require('./dbCmds.js');

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

module.exports.startUp = async (client) => {
	const now = Math.floor(new Date().getTime() / 1000.0);
	const time = `<t:${now}:t>`;

	const btns = additionButtons();

	let countSearchWarrants = await dbCmds.readValue("countSearchWarrants");
	let countSubpoenas = await dbCmds.readValue("countSubpoenas");
	let countMoneySeized = formatter.format(await dbCmds.readValue("countMoneySeized"));
	let countGunsSeized = await dbCmds.readValue("countGunsSeized");

	countSearchWarrants = countSearchWarrants.toString();
	countSubpoenas = countSubpoenas.toString();
	countMoneySeized = countMoneySeized.toString();
	countGunsSeized = countGunsSeized.toString();

	const searchWarrantsEmbed = new EmbedBuilder()
		.setTitle('Amount of Search Warrants served:')
		.setDescription(countSearchWarrants)
		.setColor('#B0BBE8');

	const subpoenasEmbed = new EmbedBuilder()
		.setTitle('Amount of Subpoenas served:')
		.setDescription(countSubpoenas)
		.setColor('#F0D8B6');

	const moneySeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Money seized:')
		.setDescription(countMoneySeized)
		.setColor('#ABDBC1');

	const gunsSeizedEmbed = new EmbedBuilder()
		.setTitle('Amount of Guns seized:')
		.setDescription(countGunsSeized)
		.setColor('#F0C7EA');

	const oldEmbed = await dbCmds.readMsgId("embedMsg");

	const channel = await client.channels.fetch('1060775654867619901')
	try {
		const oldMsg = await channel.messages.fetch(oldEmbed);
		await oldMsg.delete();
	}
	catch (error) {
		console.log(`[startup.js] Unable to delete message - message ID ${oldEmbed} not found.`);
	}

	client.embedMsg = await client.channels.cache.get('1060775654867619901').send({ embeds: [searchWarrantsEmbed, subpoenasEmbed, moneySeizedEmbed, gunsSeizedEmbed], components: [btns] });
	await dbCmds.setMsgId("embedMsg", client.embedMsg.id);

	await client.channels.cache.get('1061401888391712859').send(`:bangbang: The bot started up at ${time}.`)
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
			.setStyle(ButtonStyle.Success)
	);
	return row;
}