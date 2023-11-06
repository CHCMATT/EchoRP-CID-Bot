require("dotenv/config");
const fs = require('fs');
const mongoose = require("mongoose");
var { google } = require('googleapis');
const startup = require('./startup.js');
const interact = require('./dsInteractions.js');
const message = require('./dsMessages.js');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages], partials: [Partials.Channel, Partials.Message, Partials.Reaction] });

client.commands = new Collection();
client.buttons = new Collection();

client.login(process.env.TOKEN);

const fileParts = __filename.split(/[\\/]/);
const fileName = fileParts[fileParts.length - 1];

client.once('ready', async () => {
	console.log(`[${fileName}] The client is starting up!`);
	mongoose.set("strictQuery", false);
	mongoose.connect(process.env.MONGO_URI);
	console.log(`[${fileName}] Connected to Mongo!`);

	// Google Sheets Authorization Stuff
	var auth = new google.auth.GoogleAuth({
		keyFile: "./sheets-creds.json",
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	})
	var sheetClient = auth.getClient();
	var googleSheets = google.sheets({ version: "v4", auth: sheetClient });

	// Stuff that will be very useful in our project
	client.auth = auth;
	client.sheetId = process.env.SPREADSHEET_ID;
	client.googleSheets = googleSheets.spreadsheets;
	console.log(`[${fileName}] Connected to Google Sheets!`);

	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Find all the files in the command folder that end with .js
	const cmdList = []; // Create an empty array for pushing each command file to
	for (const file of commandFiles) { // For each file in command files group
		const command = require(`./commands/${file}`); // Get the information that is in the file
		console.log(`[${fileName}] Added ${file}!`); // Log that the command was added
		cmdList.push(command); // push that command to the array
		client.commands[command.name] = command; // Save the command name and command information to the client
	}
	console.log(`[${fileName}] Getting commands for guild ID ${process.env.DISCORD_SERVER_ID}.`);
	const allCommands = await client.guilds.cache.get(process.env.DISCORD_SERVER_ID).commands.set(cmdList) // Sets all the commands
		.catch(console.error);
	const cmdIDs = allCommands.keys();
	for (let i = 0; i < allCommands.size; i++) {
		const cmdID = cmdIDs.next().value;
		const cmdName = await allCommands.get(cmdID).name;
		let permission = client.commands[cmdName].permission;
		if (permission != undefined) { // If no permissions are given, don't update any permissions
			if (permission.length == undefined) { // If the permission isn't already an array (more than 1 permission), turn it into an array as that is what the function requires
				permission = [permission];
			}
			client.guilds.cache.get(process.env.DISCORD_SERVER_ID).commands.permissions.set({ command: cmdID, permissions: permission })
				.catch(console.error);
		}
	}

	interact(client); // Fire whenever an interaction is created
	message(client); // Fire whenever a message is created
	console.log(`[${fileName}] Connected to ${client.guilds.cache.size} guild(s).`); // Lists the number of guilds that the client is connected to
	const keys = client.guilds.cache.keys(); // Gets the keys for the map object from the guilds object
	for (const entry of keys) { // For each guild
		console.log(`[${fileName}] Connected to guild ID ${entry}.`); // Log the guild Key (guild.id)
	}
	console.log(`[${fileName}] Client is ready.`);

	await startup.startUp(client);;
});