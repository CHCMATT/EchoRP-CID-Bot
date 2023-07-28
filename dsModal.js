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

function strCleanup(str) {
	var cleaned = str.replaceAll('`', '-').replaceAll('\\', '-');
	return cleaned;
};

module.exports.modalSubmit = async (interaction) => {
	try {
		const modalID = interaction.customId;
		switch (modalID) {
			case 'moneySeizedModal':
				var now = Math.floor(new Date().getTime() / 1000.0);
				var nowDate = `<t:${now}:d>`;

				const moneySeized = Math.abs(Number(strCleanup(interaction.fields.getTextInputValue('moneySeizedInput')).replaceAll(',', '').replaceAll('$', '')));
				const moneyCaseNum = strCleanup(interaction.fields.getTextInputValue('moneyCaseNumInput'));
				const moneyCaseFileLink = strCleanup(interaction.fields.getTextInputValue('moneyCaseFileLinkInput'));

				await interaction.client.googleSheets.values.append({
					auth: interaction.client.auth, spreadsheetId: interaction.client.sheetId, range: "Money Seized!A:E", valueInputOption: "RAW", resource: { values: [[`${interaction.member.nickname} (<@${interaction.user.id}>)`, nowDate, moneySeized, moneyCaseNum, moneyCaseFileLink]] }
				});

				if (isNaN(moneySeized)) { // validate quantity of money
					await interaction.reply({
						content: `:exclamation: \`${strCleanup(interaction.fields.getTextInputValue('moneySeizedInput'))}\` is not a valid number, please be sure to only enter numbers.`,
						ephemeral: true
					});
				} else if (isNaN(moneyCaseNum)) { // validate case number
					await interaction.reply({
						content: `:exclamation: \`${strCleanup(interaction.fields.getTextInputValue('moneyCaseNumInput'))}\` is not a valid number, please be sure to only enter numbers (no # or letters).`,
						ephemeral: true
					});
				} else if (!isValidUrl(moneyCaseFileLink)) { // validate case file link
					await interaction.reply({
						content: `:exclamation: \`${strCleanup(interaction.fields.getTextInputValue('moneyCaseFileLinkInput'))}\` is not a valid URL, please be sure to enter a URL including the \`http\:\/\/\` or \`https\:\/\/\` portion.`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countMoneySeized", moneySeized);
					const newTotal = formatter.format(await dbCmds.readValue("countMoneySeized"));
					const moneySeizedFormatted = formatter.format(moneySeized);
					await editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${moneySeizedFormatted}\` to the \`Money Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send({
						content: `:white_check_mark: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) added \`${moneySeizedFormatted}\` to the \`Money Seized\` counter for a new total of \`${newTotal}\`. The associated Report # is \`${moneyCaseNum}\` with Case File \`${moneyCaseFileLink}\`.`
					});
				}
				break;
			case 'gunsSeizedModal':
				var now = Math.floor(new Date().getTime() / 1000.0);
				var nowDate = `<t:${now}:d>`;

				const gunsSeized = Math.abs(Number(strCleanup(interaction.fields.getTextInputValue('gunsSeizedInput'))));
				const gunsLocation = strCleanup(interaction.fields.getTextInputValue('gunsLocationInput'));

				await interaction.client.googleSheets.values.append({
					auth: interaction.client.auth, spreadsheetId: interaction.client.sheetId, range: "Guns Seized!A:D", valueInputOption: "RAW", resource: { values: [[`${interaction.member.nickname} (<@${interaction.user.id}>)`, nowDate, gunsSeized, gunsLocation]] }
				});

				//remove period (.) from end of string
				while (gunsLocation[gunsLocation.length - 1] === ".") {
					gunsLocation = gunsLocation.slice(0, -1);
				}

				//remove comma (,) from end of string
				while (gunsLocation[gunsLocation.length - 1] === ",") {
					gunsLocation = gunsLocation.slice(0, -1);
				}

				if (isNaN(gunsSeized)) { // validate quantity of guns
					await interaction.reply({
						content: `:exclamation: \`${strCleanup(interaction.fields.getTextInputValue('gunsSeizedInput'))}\` is not a valid number, please be sure to only enter numbers.`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countGunsSeized", gunsSeized);
					const newTotal = await dbCmds.readValue("countGunsSeized");
					await editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${gunsSeized}\` to the \`Guns Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send({
						content: `:white_check_mark: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) added \`${gunsSeized}\` to the \`Guns Seized\` counter for a new total of \`${newTotal}\`. The guns were seized from \`${gunsLocation}\`.`
					})
				}
				break;
			case 'drugsSeizedModal':
				var now = Math.floor(new Date().getTime() / 1000.0);
				var nowDate = `<t:${now}:d>`;

				const drugsSeized = Math.abs(Number(strCleanup(interaction.fields.getTextInputValue('drugsSeizedInput'))));

				await interaction.client.googleSheets.values.append({
					auth: interaction.client.auth, spreadsheetId: interaction.client.sheetId, range: "Drugs Seized!A:C", valueInputOption: "RAW", resource: { values: [[`${interaction.member.nickname} (<@${interaction.user.id}>)`, nowDate, drugsSeized]] }
				});
				if (isNaN(drugsSeized)) { // validate quantity of drugs
					await interaction.reply({
						content: `:exclamation: \`${strCleanup(interaction.fields.getTextInputValue('drugsSeizedInput'))}\` is not a valid number, please be sure to only enter numbers.`,
						ephemeral: true
					});
				} else {
					await dbCmds.addValue("countDrugsSeized", drugsSeized);
					const newTotal = await dbCmds.readValue("countDrugsSeized");
					await editEmbed.editEmbed(interaction.client);
					await interaction.reply({
						content: `Successfully added \`${drugsSeized}\` to the \`Drugs Seized\` counter - the new total is \`${newTotal}\`.`,
						ephemeral: true
					});
					await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send({
						content: `:white_check_mark: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) added \`${drugsSeized}\` to the \`Drugs Seized\` counter for a new total of \`${newTotal}\`.`
					})
				}
				break;
			case 'callsAttendedModal':
				var now = Math.floor(new Date().getTime() / 1000.0);
				var nowDate = `<t:${now}:d>`;

				let callsAttendedReportNum = strCleanup(interaction.fields.getTextInputValue('callsAttendedReportNumInput'));
				let callsAttendedNotes = strCleanup(interaction.fields.getTextInputValue('callsAttendedNotesInput'));
				let callsAttendedAddtlOffc = strCleanup(interaction.fields.getTextInputValue('callsAttendedAddtlOffcInput'));

				await interaction.client.googleSheets.values.append({
					auth: interaction.client.auth, spreadsheetId: interaction.client.sheetId, range: "Calls Attended!A:E", valueInputOption: "RAW", resource: { values: [[`${interaction.member.nickname} (<@${interaction.user.id}>)`, nowDate, callsAttendedReportNum, callsAttendedNotes, callsAttendedAddtlOffc]] }
				});

				//remove period (.) from end of strings
				while (callsAttendedReportNum[callsAttendedReportNum.length - 1] === ".") {
					callsAttendedReportNum = callsAttendedReportNum.slice(0, -1);
				}
				while (callsAttendedNotes[callsAttendedNotes.length - 1] === ".") {
					callsAttendedNotes = callsAttendedNotes.slice(0, -1);
				}
				while (callsAttendedAddtlOffc[callsAttendedAddtlOffc.length - 1] === ".") {
					callsAttendedAddtlOffc = callsAttendedAddtlOffc.slice(0, -1);
				}

				//remove comma (,) from end of strings
				while (callsAttendedReportNum[callsAttendedReportNum.length - 1] === ",") {
					callsAttendedReportNum = callsAttendedReportNum.slice(0, -1);
				}
				while (callsAttendedNotes[callsAttendedNotes.length - 1] === ",") {
					callsAttendedNotes = callsAttendedNotes.slice(0, -1);
				}
				while (callsAttendedAddtlOffc[callsAttendedAddtlOffc.length - 1] === ",") {
					callsAttendedAddtlOffc = callsAttendedAddtlOffc.slice(0, -1);
				}

				await dbCmds.addOne("countCallsAttended");
				const newTotal = await dbCmds.readValue("countCallsAttended");
				await editEmbed.editEmbed(interaction.client);

				let msgContent = `:white_check_mark: \`${interaction.member.nickname}\` (\`${interaction.member.user.username}\`) added \`1\` to the \`Calls Attended\` counter for a new total of \`${newTotal}\`.`
				if (callsAttendedReportNum && callsAttendedReportNum.toLowerCase() != 'n/a' && callsAttendedReportNum.toLowerCase() != 'na') { msgContent = msgContent + ` The associated Report # is \`${callsAttendedReportNum}\`.` }
				if (callsAttendedNotes) { msgContent = msgContent + ` The following notes were included: \`${callsAttendedNotes}\`.` }
				if (callsAttendedAddtlOffc) { msgContent = msgContent + ` The listed additional CID members were: \`${callsAttendedAddtlOffc}\`.` }
				await interaction.reply({ content: `Successfully added \`1\` to the \`Calls Attended\` counter - the new total is \`${newTotal}\`.`, ephemeral: true });
				await interaction.client.channels.cache.get(process.env.AUDIT_CHANNEL_ID).send(msgContent);
				break;
			default:
				await interaction.reply({
					content: `I'm not familiar with this modal type. Please tag @CHCMATT to fix this issue.`,
					ephemeral: true
				});
				console.log(`Error: Unrecognized modal ID: ${interaction.customId}`);
		}
	} catch (error) {
		if (process.env.BOT_NAME == 'test') {
			console.error(error);
		} else {
			console.error(error);

			let errTime = moment().format('MMMM Do YYYY, h:mm:ss a');;
			let fileParts = __filename.split(/[\\/]/);
			let fileName = fileParts[fileParts.length - 1];

			console.log(`Error occured at ${errTime} at file ${fileName}!`);

			let errorEmbed = [new EmbedBuilder()
				.setTitle(`An error occured on the ${process.env.BOT_NAME} bot file ${fileName}!`)
				.setDescription(`\`\`\`${error.toString().slice(0, 2000)}\`\`\``)
				.setColor('B80600')
				.setFooter({ text: `${errTime}` })];

			await interaction.client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID).send({ embeds: errorEmbed });
		}
	}
};


