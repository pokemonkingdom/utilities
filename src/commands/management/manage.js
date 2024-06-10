const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const translateAttribute = require('../../functions/handlers/translateAttribute');
const guildSchema = require('../../schemas/guild');

console.log('TranslateAttribute');
console.log(translateAttribute);
module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('manage')
        .setDescription('Bot management')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommandGroup(group => group
            .setName('staff')
            .setDescription('Manage the server staff')
            .setDescriptionLocalizations(translateAttribute('manage', 'staff.description'))
            .addSubcommand(subcommand => subcommand
                .setName('addrole')
                .setDescription('Add a role to the staff list')
                .setDescriptionLocalizations(translateAttribute('manage', 'staff.addrole.description'))
                .addRoleOption(option => option
                    .setName('role')
                    .setDescription('The role to add')
                    .setDescriptionLocalizations(translateAttribute('manage', 'staff.addrole.role.description'))
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('slug')
                    .setDescription('The role slug')
                    .setDescriptionLocalizations(translateAttribute('manage', 'staff.addrole.slug.description'))
                    .setRequired(true)
                )
                .addIntegerOption(option => option
                    .setName('level')
                    .setDescription('The role level')
                    .setDescriptionLocalizations(translateAttribute('manage', 'staff.addrole.level.description'))
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('removerole')
                .setDescription('Remove a role from the staff list')
                .setDescriptionLocalizations(translateAttribute('manage', 'staff.removerole.description'))
                .addStringOption(option => option
                    .setName('role')
                    .setDescription('The role to remove')
                    .setDescriptionLocalizations(translateAttribute('manage', 'staff.removerole.role.description'))
                    .addChoices(async (interaction) => {
                        return await this.getCurrentRoleList(interaction, client);
                    })
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('listroles')
                .setDescription('List all staff roles')
                .setDescriptionLocalizations(translateAttribute('manage', 'staff.listroles.description'))
            )
        )
        .addSubcommandGroup(group => group
            .setName('guild')
            .setDescription('Manage the server settings')
            .setDescriptionLocalizations(translateAttribute('manage', 'guild.description'))
            .addSubcommand(subcommand => subcommand
                .setName('setwelcome')
                .setDescription('Set the welcome channel')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.setwelcome.description'))
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('The welcome channel')
                    .setDescriptionLocalizations(translateAttribute('manage', 'guild.setwelcome.channel.description'))
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('setmessagelog')
                .setDescription('Set the message log channel')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.setmessagelog.description'))
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('The message log channel')
                    .setDescriptionLocalizations(translateAttribute('manage', 'guild.setmessagelog.channel.description'))
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('setmodlog')
                .setDescription('Set the moderation log channel')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.setmodlog.description'))
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('The moderation log channel')
                    .setDescriptionLocalizations(translateAttribute('manage', 'guild.setmodlog.channel.description'))
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('setreport')
                .setDescription('Set the report channel')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.setreport.description'))
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('The report channel')
                    .setDescriptionLocalizations(translateAttribute('manage', 'guild.setreport.channel.description'))
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('togglewelcome')
                .setDescription('Toggle the welcome message')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.togglewelcome.description'))
            )
            .addSubcommand(subcommand => subcommand
                .setName('togglemessagelog')
                .setDescription('Toggle the message log')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.togglemessagelog.description'))
            )
            .addSubcommand(subcommand => subcommand
                .setName('togglemodlog')
                .setDescription('Toggle the moderation log')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.togglemodlog.description'))
            )
            .addSubcommand(subcommand => subcommand
                .setName('togglereport')
                .setDescription('Toggle the report channel')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.togglereport.description'))
            )
            .addSubcommand(subcommand => subcommand
                .setName('addlink')
                .setDescription('Link the server to another server')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.addlink.description'))
                .addStringOption(option => option
                    .setName('server')
                    .setDescription('The ID of the server to link')
                    .setDescriptionLocalizations(translateAttribute('manage', 'guild.addlink.server.description'))
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('removelink')
                .setDescription('Remove server link from another server')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.removelink.description'))
                .addStringOption(option => option
                    .setName('server')
                    .setDescription('The ID of the server to unlink')
                    .setDescriptionLocalizations(translateAttribute('manage', 'guild.removelink.server.description'))
                    .addChoices(async (interaction) => {
                        return await this.getCurrentLinkList(interaction, client);
                    })
                    .setRequired(true)
                )

            )
            .addSubcommand(subcommand => subcommand
                .setName('reset')
                .setDescription('Reset the server settings')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.reset.description'))
            )
        ),
    async getCurrentRoleList(interaction) {
        const guildID = interaction.guild.id;
        const guild = await guildSchema.findOne({ guildID });
        const staffRoleList = guild.staffRoleList;
        const roles = interaction.guild.roles.cache.filter(role => staffRoleList.includes(role.id));
        const choices = roles.map(role => ({ name: role.name, value: role.id }));
        return choices;
    },
    async getCurrentLinkList(interaction) {
        const guildID = interaction.guild.id;
        const guild = await guildSchema.findOne({ guildID });
        const links = guild.linkedGuilds;
        const choices = links.map(link => ({ name: link.guildName, value: link.guildID }));
        return choices;
    },
    async execute(interaction, client) {
        switch (interaction.options.getSubcommandGroup()) {
            case 'staff':
                switch (interaction.options.getSubcommand()) {
                    case 'addrole': {
                        const role = interaction.options.getRole('role');
                        const slug = interaction.options.getString('slug');
                        const level = interaction.options.getInteger('level');
                        await addRoleToStaffList(role, slug, level);
                        break;
                    }
                    case 'removerole': {
                        const role = interaction.options.getString('role');
                        await removeRoleFromStaffList(role);
                        break;
                    }
                    case 'listroles': {
                        await listStaffRoles();
                        break;
                    }
                }
                break;
            case 'guild':
                switch (interaction.options.getSubcommand()) {
                    case 'setwelcome': {
                        const channel = interaction.options.getChannel('channel');
                        await setWelcomeChannel(channel);
                        break;
                    }
                    case 'setmessagelog': {
                        const channel = interaction.options.getChannel('channel');
                        await setMessageLogChannel(channel);
                        break;
                    }
                    case 'setmodlog': {
                        const channel = interaction.options.getChannel('channel');
                        await setModLogChannel(channel);
                        break;
                    }
                    case 'setreport': {
                        const channel = interaction.options.getChannel('channel');
                        await setReportChannel(channel);
                        break;
                    }
                    case 'togglewelcome': {
                        await toggleWelcomeMessage();
                        break;
                    }
                    case 'togglemessagelog': {
                        await toggleMessageLog();
                        break;
                    }
                    case 'togglemodlog': {
                        await toggleModLog();
                        break;
                    }
                    case 'togglereport': {
                        await toggleReportChannel();
                        break;
                    }
                    case 'addlink': {
                        const server = interaction.options.getString('server');
                        await addServerLink(server);
                        break;
                    }
                    case 'removelink': {
                        const server = interaction.options.getString('server');
                        await removeServerLink(server);
                        break;
                    }
                    case 'reset': {
                        await resetServerSettings();
                        break;
                    }
                    default:
                        break;
                };
                break;
            default:
                break;
        };
    },
};

/**
 * Add a role to the staff list
 * @param {*} role Role to add
 * @param {*} slug Slug of the role
 * @param {*} level Level of the role
 * @returns If the role was added successfully
 */
async function addRoleToStaffList(role, slug, level) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the role is already in the staff list
    if (guild.staffRoleList.includes(role.id)) {
        await interaction.reply({ content: 'Role is already in the staff list', ephemeral: true });
        return false;
    }

    // Normalize the slug
    slug = slug.toLowerCase();
    // Only allow alphanumeric characters and hyphens
    slug = slug.replace(/[^a-z0-9-]/g, '');

    // Check if there's already a role with the same slug
    const existingRole = Object.values(guild.staffRoles).find(staffRole => staffRole.slug === slug);
    if (existingRole) {
        await interaction.reply({ content: 'A role with the same slug already exists', ephemeral: true });
        return false;
    }

    // Check if the level is valid
    if (level < 0) {
        await interaction.reply({ content: 'Level must be a positive number', ephemeral: true });
        return false;
    }

    // Check if the level is already in use
    const existingLevel = Object.values(guild.staffRoles).find(staffRole => staffRole.level === level);
    if (existingLevel) {
        // Increment the level of each role with a level greater than or equal to the new level
        Object.values(guild.staffRoles).forEach(staffRole => {
            if (staffRole.level >= level) {
                staffRole.level++;
            }
        });
    }

    // If the level is higher than the amount of roles, set it to the amount of roles + 1
    if (level > guild.staffRoleList.length) {
        level = guild.staffRoleList.length + 1;
    }

    // Create a new staff role object
    const staffRole = { name: slug, roleID: role.id, level: level };
    guild.staffRoleList.push(staffRole);

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Role added', ephemeral: true });
    return true;
}

/**
 * Remove a role from the staff list
 * @param {*} role The role to remove
 * @returns If the role was removed successfully
 */
async function removeRoleFromStaffList(role) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if the role is in the staff list
    if (!guild.staffRoleList.includes(role.id)) {
        await interaction.reply({ content: 'Role is not in the staff list', ephemeral: true });
        return false;
    }

    // Remove the role from the list and modify the levels of the other roles
    const staffRole = guild.staffRoles[role.id];
    const level = staffRole.level;
    guild.staffRoleList = guild.staffRoleList.filter(staffRole => staffRole.roleID !== role.id);
    delete guild.staffRoles[role.id];
    Object.values(guild.staffRoles).forEach(staffRole => {
        if (staffRole.level > level) {
            staffRole.level--;
        }
    });

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Role removed', ephemeral: true });
    return true;
}

/**
 * List all staff roles
 */
async function listStaffRoles() {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const staffRoles = guild.staffRoles;
    const roles = Object.values(staffRoles).sort((a, b) => a.level - b.level);
    const roleList = roles.map(role => `${role.level}. ${role.name}`);
    await interaction.reply({ content: roleList.join('\n'), ephemeral: true });
}

/**
 * Set the welcome channel
 * @param {*} channel The welcome channel
 * @returns If the channel was set successfully
 */
async function setWelcomeChannel(channel) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Set the welcome channel
    guild.welcomeChannel = channel.id;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Welcome channel set', ephemeral: true });
    return true;
}

/**
 * Set the message log channel
 * @param {*} channel The message log channel
 * @returns If the channel was set successfully
 */
async function setMessageLogChannel(channel) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Set the message log channel
    guild.messageLogChannel = channel.id;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Message log channel set', ephemeral: true });
    return true;
}

/**
 * Set the moderation log channel
 * @param {*} channel The moderation log channel
 * @returns If the channel was set successfully
 */
async function setModLogChannel(channel) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Set the moderation log channel
    guild.modLogChannel = channel.id;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Moderation log channel set', ephemeral: true });
    return true;
}

/**
 * Set the report channel
 * @param {*} channel The report channel
 * @returns If the channel was set successfully
 */
async function setReportChannel(channel) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Set the report channel
    guild.reportChannel = channel.id;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Report channel set', ephemeral: true });
    return true;
}

/**
 * Toggle the welcome message
 * @returns If the welcome message was toggled successfully
 */
async function toggleWelcomeMessage() {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if a welcome channel is set
    if (!guild.welcomeChannel) {
        await interaction.reply({ content: 'Set the welcome channel first', ephemeral: true });
        return false;
    }

    // Toggle the welcome message
    guild.welcomeEnabled = !guild.welcomeEnabled;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Welcome message toggled', ephemeral: true });
    return true;
}

/**
 * Toggle the message log
 * @returns If the message log was toggled successfully
 */
async function toggleMessageLog() {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if a message log channel is set
    if (!guild.messageLogChannel) {
        await interaction.reply({ content: 'Set the message log channel first', ephemeral: true });
        return false;
    }

    // Toggle the message log
    guild.messageLogEnabled = !guild.messageLogEnabled;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Message log toggled', ephemeral: true });
    return true;
}

/**
 * Toggle the moderation log
 * @returns If the moderation log was toggled successfully
 */
async function toggleModLog() {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if a moderation log channel is set
    if (!guild.modLogChannel) {
        await interaction.reply({ content: 'Set the moderation log channel first', ephemeral: true });
        return false;
    }

    // Toggle the moderation log
    guild.modLogEnabled = !guild.modLogEnabled;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Moderation log toggled', ephemeral: true });
    return true;
}

/**
 * Toggle the report channel
 * @returns If the report channel was toggled successfully
 */
async function toggleReportChannel() {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if a report channel is set
    if (!guild.reportChannel) {
        await interaction.reply({ content: 'Set the report channel first', ephemeral: true });
        return false;
    }

    // Toggle the report channel
    guild.reportEnabled = !guild.reportEnabled;

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Report channel toggled', ephemeral: true });
    return true;
}

/**
 * Add a server link
 * @param {*} server The ID of the server to link
 * @returns If the server was linked successfully
 */
async function addServerLink(server) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const otherGuild = await guildSchema.findOne({ guildID: server });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'This guild is not in the database. Run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if the other schema exists
    if (!otherGuild) {
        await interaction.reply({ content: 'The specified guild is not in the database. Run `/setup` in that guild first!', ephemeral: true });
        return false;
    }

    // Check if the server is already linked
    if (guild.linkedGuilds.includes(server)) {
        await interaction.reply({ content: 'A link already exists!', ephemeral: true });
        return false;
    }

    // Add the server to the linked servers
    guild.linkedGuilds.push({ guildID: server, relationship: 'staff' });

    // Add the current server to the other server's linked servers
    otherGuild.linkedGuilds.push({ guildID: guildID, relationship: 'main' });

    // Save both guild documents
    await guild.save();
    await otherGuild.save();

    await interaction.reply({ content: 'Servers linked successfully', ephemeral: true });
    return true;
}

/**
 * Remove a server link
 * @param {*} server The ID of the server to unlink
 * @returns If the server was unlinked successfully
 */
async function removeServerLink(server) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const otherGuild = await guildSchema.findOne({ guildID: server });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'This guild isn\'t in the database. Run `/setup` first!', ephemeral: true });
        return false;
    }

    // Check if the other schema exists
    if (!otherGuild) {
        await interaction.reply({ content: 'The provided guild couldn\'t be found.', ephemeral: true });
        return false;
    }

    // Check if the server is not linked
    if (!guild.linkedGuilds.includes(server)) {
        await interaction.reply({ content: 'There\'s no link with that server', ephemeral: true });
        return false;
    }

    // Remove the server from the linked servers
    guild.linkedGuilds = guild.linkedGuilds.filter(link => link.guildID !== server);

    // Remove the current server from the other server's linked servers
    otherGuild.linkedGuilds = otherGuild.linkedGuilds.filter(link => link.guildID !== guildID);

    // Save both guild documents
    await guild.save();
    await otherGuild.save();

    await interaction.reply({ content: 'Servers unlinked successfully', ephemeral: true });
    return true;
}

/**
 * Reset the server settings
 * @returns If the server settings were reset successfully
 */
async function resetServerSettings() {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        await interaction.reply({ content: 'Guild not found, run `/setup` first!', ephemeral: true });
        return false;
    }

    // Reset server information
    guild.staffRoleList = [];
    guild.welcomeChannel = null;
    guild.welcomeEnabled = false;
    guild.messageLogChannel = null;
    guild.messageLogEnabled = false;
    guild.modLogChannel = null;
    guild.modLogEnabled = false;
    guild.reportChannel = null;
    guild.reportEnabled = false;

    // Get the linked servers
    const linkedGuilds = guild.linkedGuilds;
    for (const link of linkedGuilds) {
        const otherGuild = await guildSchema.findOne({ guildID: link.guildID });
        otherGuild.linkedGuilds = otherGuild.linkedGuilds.filter(link => link.guildID !== guildID);
        await otherGuild.save();
    }
    guild.linkedGuilds = [];

    // Save the guild document
    await guild.save();

    await interaction.reply({ content: 'Server reset successful', ephemeral: true });
    return true;
}


// This function will be used in the future when the messages are changed to embeds
// In the meantime, it will be left as a reference
/**
 * Fetch the translations for the command
 * @param {*} command The command name
 * @param {*} attribute The attribute to fetch
 * @returns The translations for the command
 */
async function fetchTranslations(command, attribute) {
    console.log(`Fetching translations for ${command}.${attribute}`)
    const locales = ['id', 'da', 'de', 'en-GB', 'en-US', 'es-ES', 'es-419', 'fr', 'hr', 'it', 'lt', 'hu', 'nl', 'no', 'pl', 'pt-BR', 'ro', 'fi', 'sv-SE', 'vi', 'tr', 'cs', 'el', 'bg', 'ru', 'uk', 'hi', 'th', 'zh-CN', 'ja', 'zh-TW', 'ko'];
    const translations = {};

    for (const locale of locales) {
        const translation = client.translate(locale, 'commands', `${command}.${attribute}`);
        if (translation) {
            translations[locale] = translation;
        }
    }

    return translations;
}