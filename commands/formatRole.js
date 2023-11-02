const moment = require('moment');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'formatrole',
	description: 'Formats the provided role to the desired standard',
	options: [
		{
			name: 'role',
			description: 'The role you\'d like to format',
			type: 8,
			required: true,
		},
		{
			name: 'newname',
			description: 'The new name of the role you\'d like to format',
			type: 3,
			required: true,
		},
	],
	async execute(interaction) {
		try {
			if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id == '177088916250296320') {
				const role = interaction.options.getRole('role');
				const oldName = role.name;
				const newName = interaction.options.getString('newname');
				try {
					await interaction.guild.roles.cache.get(role.id).setName(`${newName}`, `Requested by: ${interaction.member.user.username}`);
					await interaction.reply({ content: `Successfully changed role name of \`${oldName}\` to \`${newName}\`.`, ephemeral: true });
				}
				catch (error) {
					await interaction.reply({ content: `:warning: Unable to change role name - my highest role isn't higher than \`${role.name}\`.`, ephemeral: true });
				}
			}
			else {
				await interaction.reply({ content: `:x: You must have the \`Administrator\` permission to use this function.`, ephemeral: true });
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
	},
};