module.exports = {
	name: 'ping',
	description: 'Replies with Pong!',
	async execute(interaction) {
			await interaction.reply({content: 'Pong!', ephemeral: true});
	},
};

// only run for specific user
	//if (interaction.user.id == "userId") return;
  //if (interaction.user.id !== "userId") return;
// only run for specific role
  //if (!interaction.member.roles.cache.has("roleId")) return;
// only run for specific permission
  //if (!interaction.member.permissions.has("BAN_MEMBERS")) return; // You can use any permission flag of course