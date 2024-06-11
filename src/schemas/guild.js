const { Schema, model } = require('mongoose');

let guildSchema = new Schema({
    guildID: String,
    guildName: String,
    staffRoleList: { type: Array, default: [] },
    welcomeChannel: { type: String, default: null },
    welcomeEnabled: { type: Boolean, default: false },
    messageLogChannel: { type: String, default: null },
    messageLogEnabled: { type: Boolean, default: false },
    modLogChannel: { type: String, default: null },
    modLogEnabled: { type: Boolean, default: false },
    reportChannel: { type: String, default: null },
    reportEnabled: { type: Boolean, default: false },
    linkedGuilds: { type: Array, default: [] },
});

module.exports = model('guild', guildSchema, 'guilds');