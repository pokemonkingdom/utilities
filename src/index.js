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
const schemaRStaff = require('./schemas/pkServer.js')
setInterval(async function() {
    const logs = client.channels.cache.get('1248731811534864394')
    const pk = client.guilds.cache.get(`${process.env.guildID}`)
    const staff = client.guilds.cache.get(`${process.env.staffGuildID}`)
    const dataPK = await schemaRStaff.findOne({ Servidor: pk.id });
    const dataPKS = await schemaRStaff.findOne({ Servidor: staff.id });
    const monarcas = pk.members.cache.filter(member => member.roles.cache.has(dataPK.Monarca));
    monarcas.forEach(async member => {
        const usuario = await staff.members.cache.get(member.id)
        if(!usuario) {
            logs.send({ content: 'No está en el servidor'})
        }
        if(usuario) {
            if(usuario.roles.cache.get(dataPKS.Monarca)) {
                return;
            }
            logs.send({ content: `Agregado rol de <@&${dataPKS.Monarca}> a ${usuario.id} / ${usuario.user.username}`, allowedMentions: { parse: [] }})
            usuario.roles.add(dataPKS.Monarca)
        }
    });

    const duques = pk.members.cache.filter(member => member.roles.cache.has(dataPK.Duque));
    duques.forEach(async member => {
        const usuario = await staff.members.cache.get(member.id)
        if(!usuario) {
            logs.send({ content: 'No está en el servidor'})
        }
        if(usuario) {
            if(usuario.roles.cache.get(dataPKS.Duque)) {
                return;
            }
            logs.send({ content: `Agregado rol de <@&${dataPKS.Duque}> a ${usuario.id} / ${usuario.user.username}`, allowedMentions: { parse: [] }})
            usuario.roles.add(dataPKS.Duque)
        }
    });

    const consejero = pk.members.cache.filter(member => member.roles.cache.has(dataPK.ConsejeroReal));
    consejero.forEach(async member => {
        const usuario = await staff.members.cache.get(member.id)
        if(!usuario) {
            logs.send({ content: 'No está en el servidor'})
        }
        if(usuario) {
            if(usuario.roles.cache.get(dataPKS.ConsejeroReal)) {
                return;
            }
            logs.send({ content: `Agregado rol de <@&${dataPKS.ConsejeroReal}> a ${usuario.id} / ${usuario.user.username}`, allowedMentions: { parse: [] }})
            usuario.roles.add(dataPKS.ConsejeroReal)
        }
    });

    const guardian = pk.members.cache.filter(member => member.roles.cache.has(dataPK.GuardianReal));
    guardian.forEach(async member => {
        const usuario = await staff.members.cache.get(member.id)
        if(!usuario) {
            logs.send({ content: 'No está en el servidor'})
        }
        if(usuario) {
            if(usuario.roles.cache.get(dataPKS.GuardianReal)) {
                return;
            }
            logs.send({ content: `Agregado rol de <@&${dataPKS.GuardianReal}> a ${usuario.id} / ${usuario.user.username}`, allowedMentions: { parse: [] }})
            usuario.roles.add(dataPKS.GuardianReal)
        }
    });

    const escudero = pk.members.cache.filter(member => member.roles.cache.has(dataPK.EscuderoReal));
    escudero.forEach(async member => {
        const usuario = await staff.members.cache.get(member.id)
        if(!usuario) {
            logs.send({ content: 'No está en el servidor'})
        }
        if(usuario) {
            if(usuario.roles.cache.get(dataPKS.EscuderoReal)) {
                return;
            }
            logs.send({ content: `Agregado rol de <@&${dataPKS.EscuderoReal}> a ${usuario.id} / ${usuario.user.username}`, allowedMentions: { parse: [] }})
            usuario.roles.add(dataPKS.EscuderoReal)
        }
    });

    const bufon = pk.members.cache.filter(member => member.roles.cache.has(dataPK.BufonReal));
    escudero.forEach(async member => {
        const usuario = await staff.members.cache.get(member.id)
        if(!usuario) {
            logs.send({ content: 'No está en el servidor'})
        }
        if(usuario) {
            if(usuario.roles.cache.get(dataPKS.BufonReal)) {
                return;
            }
            logs.send({ content: `Agregado rol de <@&${dataPKS.BufonReal}> a ${usuario.id} / ${usuario.user.username}`, allowedMentions: { parse: [] }})
            usuario.roles.add(dataPKS.BufonReal)
        }
    });
}, 3000);