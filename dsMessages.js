const moment = require('moment');

module.exports = (client) => {
	client.on('messageCreate', async message => {
		try {
			if (message.guild == null && message.author.id !== '1078068488716955748') {
				await message.channel.sendTyping();
				await message.author.send({ content: `Hi there! I am not able to you via DM, if you have a request, please DM <@177088916250296320> directly.` });
				console.log(message.client.channels.cache.get('177088916250296320'));
				//await message.client.channels.cache.get('').send(`test`);
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
