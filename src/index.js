// Fetch variables from .env file and other dependencies
require('dotenv').config()
const { token, dbToken } = process.env;
const { connect } = require('mongoose');
const { readdirSync } = require('fs');

// Import discord.js and client attributes
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: 32767 }); // 32767 is the sum of all intents, change before production!
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.guildCommands = [];
client.staffGuildCommands = [];
client.globalCommands = [];

// Read function files
const functionFolders = readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) {
        try {
            const func = require(`./functions/${folder}/${file}`);
            if (typeof func === 'function') {
                func(client);
            } else {
                console.error(`Error: Required file ${file} in ${folder} is not exporting a function!`)
            }
        } catch (e) {
            console.error(`Error requiring file ${file} in ${folder}: ${e}`);
        }
    }
}

client.handleEvents();
client.handleCommands();
client.handleLocales();

// Connect to Discord and MongoDB
client.login(token);
client.guilds.fetch(); // Fetch all guilds the bot is in to cache them
(async () => {
    await connect(dbToken).catch(console.error);
})();

// STAFF SYNC
const pk = client.guilds.cache.get(process.env.guildID)
const staff = client.guilds.cache.get(staffGuildID)
const rolesStaff = []
setTimeout(async => {
}, 5000)