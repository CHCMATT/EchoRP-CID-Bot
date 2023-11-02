const moment = require('moment');
const dsBtn = require('./dsBtn');
const dsModal = require('./dsModal');

module.exports = (client) => {
	client.on('interactionCreate', async interaction => {
		try {
			if (interaction.isCommand()) {
				await client.commands[interaction.commandName].execute(interaction);
			}
			else if (interaction.isButton()) {
				await dsBtn.btnPressed(interaction);
			}
			else if (interaction.isModalSubmit()) {
				await dsModal.modalSubmit(interaction);
			}
			else {
				return;
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
	});

	client.on('messageCreate', async message => {
		try {
			if (message.guild == null && message.author.id !== '1078068488716955748') {
				console.log('dm message received')
				await message.author.send({ content: `Hi there!` })
			} else {
				console.log('non-dm message received')
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
	});
};
