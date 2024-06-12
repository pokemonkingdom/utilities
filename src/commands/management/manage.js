const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const translateAttribute = require('../../functions/handlers/translateAttribute');
const guildSchema = require('../../schemas/guild');

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
                    .setName('position')
                    .setDescription('The role position')
                    .setDescriptionLocalizations(translateAttribute('manage', 'staff.addrole.position.description'))
                    .setRequired(false)
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
                    .setAutocomplete(true)
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
                .setDescription('Toggle the report system')
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
                    .setAutocomplete(true)
                    .setRequired(true)
                )

            )
            .addSubcommand(subcommand => subcommand
                .setName('reset')
                .setDescription('Reset the server settings')
                .setDescriptionLocalizations(translateAttribute('manage', 'guild.reset.description'))
            )
        ),
    async autocomplete(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup().toLowerCase();
        const subcommand = interaction.options.getSubcommand().toLowerCase();

        switch (subcommandGroup) {
            case 'staff':
                if (subcommand === 'removerole') {
                    const roles = await getCurrentRoleList(interaction);
                    return interaction.respond(roles);
                }
                break;
            case 'guild':
                if (subcommand === 'removelink') {
                    const links = await getCurrentLinkList(interaction);
                    return interaction.respond(links);
                }
                break;
            default:
                break;
        }
    },
    async execute(interaction, client) {
        const subcommandGroup = interaction.options.getSubcommandGroup().toLowerCase();
        const subcommand = interaction.options.getSubcommand().toLowerCase();

        switch (subcommandGroup) {
            case 'staff':
                switch (subcommand) {
                    case 'addrole': {
                        const role = interaction.options.getRole('role');
                        const slug = interaction.options.getString('slug');
                        const position = interaction.options.getInteger('position') || 1;
                        await addRoleToStaffList(role, slug, position, interaction, client);
                        break;
                    }
                    case 'removerole': {
                        const role = interaction.options.getString('role');
                        await removeRoleFromStaffList(role, interaction);
                        break;
                    }
                    case 'listroles': {
                        await listStaffRoles(interaction);
                        break;
                    }
                }
                break;
            case 'guild':
                switch (subcommand) {
                    case 'setwelcome': {
                        const channel = interaction.options.getChannel('channel');
                        await setWelcomeChannel(channel, interaction);
                        break;
                    }
                    case 'setmessagelog': {
                        const channel = interaction.options.getChannel('channel');
                        await setMessageLogChannel(channel, interaction);
                        break;
                    }
                    case 'setmodlog': {
                        const channel = interaction.options.getChannel('channel');
                        await setModLogChannel(channel, interaction);
                        break;
                    }
                    case 'setreport': {
                        const channel = interaction.options.getChannel('channel');
                        await setReportChannel(channel, interaction);
                        break;
                    }
                    case 'togglewelcome': {
                        await toggleWelcomeMessage(interaction);
                        break;
                    }
                    case 'togglemessagelog': {
                        await toggleMessageLog(interaction);
                        break;
                    }
                    case 'togglemodlog': {
                        await toggleModLog(interaction);
                        break;
                    }
                    case 'togglereport': {
                        await toggleReportChannel(interaction);
                        break;
                    }
                    case 'addlink': {
                        const server = interaction.options.getString('server');
                        await addServerLink(server, interaction);
                        break;
                    }
                    case 'removelink': {
                        const server = interaction.options.getString('server');
                        await removeServerLink(server, interaction);
                        break;
                    }
                    case 'reset': {
                        await resetServerSettings(interaction);
                        break;
                    }
                    default:
                        break;
                };
                break;
            default:
                break;
        };
    }
};

async function getCurrentLinkList(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const links = guild.linkedGuilds;
    const choices = links.map(link => ({ name: link.guildID, value: link.guildID }));
    return choices;
}

async function getCurrentRoleList(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const staffRoleList = guild.staffRoleList;

    // Get the role names from the guild document
    const roles = await interaction.guild.roles.fetch();

    const choices = staffRoleList.map(staffRole => {
        const role = roles.get(staffRole.roleID);
        if (!role) return { name: `[DELETED] ${staffRole.name}`, value: staffRole.roleID };
        return { name: role.name, value: role.id };
    });
    return choices;
}

/**
 * Add a role to the staff list
 * @param {*} role Role to add
 * @param {*} slug Slug of the role
 * @param {*} position Position of the role
 * @param {*} interaction The interaction object
 * @returns If the role was added successfully
 */
async function addRoleToStaffList(role, slug, position, interaction, client) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[0].response.guild_not_found');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Skip if the role is already in the staff list
    for (const role of guild.staffRoleList) {
        if (role.roleID === role.id) {
            const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[0].response.already_added');
            await interaction.reply({ content: content, ephemeral: true });
            return false;
        }
    }

    // Normalize the slug
    slug = slug
        .toLowerCase()
        .replace(/\s+|_+/g, '-')    // /\s+ 1 or more spaces, _+ 1 or more underscores; replace with hyphen (-)
        .replace(/^-+\-+$/g, '')    // /^-+ 1 or more hyphens at the start, -+$ 1 or more hyphens at the end; replace with empty string
        .replace(/[^a-z0-9-]/g, '') // /[^a-z0-9-] any character that is not a-z, 0-9, or hyphen; replace with empty string
        .replace(/-+/g, '-');       // /-+ 1 or more hyphens; replace with hyphen
    // Thanks Jeremy for the regex classes from LCIS! ~Bartolumiu

    // Skip if the slug is empty
    if (!slug) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[0].response.slug_empty');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if the slug is already in use
    for (const dbRole of guild.staffRoleList) {
        if (dbRole.name === slug) {
            const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[0].response.slug_in_use', { role: role, roleName: role.name, roleID: role.id, slug: slug, dbRoleID: dbRole.roleID })
            await interaction.reply({ content: content, ephemeral: true, allowedMentions: { repliedUser: false, roleMention: false } });
            return false;
        }
    }

    // Check if the position is valid
    if (position < 0) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[0].response.position_negative');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Increment the position of each role with a position greater than or equal to the new position
    for (const staffRole of guild.staffRoleList) {
        if (staffRole.position >= position) {
            staffRole.position++;
            // Overwrite the existing role with the updated position
            guild.staffRoleList = guild.staffRoleList.filter(role => role.roleID !== staffRole.roleID);
            guild.staffRoleList.push(staffRole);
        }
    }

    // If the position is higher than the amount of roles, set it to the amount of roles + 1
    if (position > guild.staffRoleList.length) {
        position = guild.staffRoleList.length + 1;
    }

    // Create a new staff role object
    const staffRole = { name: slug, roleID: role.id, position: position };
    guild.staffRoleList.push(staffRole);

    // Save the guild document
    await guild.save();

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[0].response.success', { role: role, position: position, slug: slug });
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Remove a role from the staff list
 * @param {*} role The role to remove
 * @param {*} interaction The interaction object
 * @returns If the role was removed successfully
 */
async function removeRoleFromStaffList(role, interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[1].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }


    // Check if the role is in the staff list
    for (const staffRole of guild.staffRoleList) {
        if (staffRole.roleID === role) {
            // Remove the role from the list and decrement the positions of the other roles
            const position = staffRole.position;
            guild.staffRoleList = guild.staffRoleList.filter(staffRole => staffRole.roleID !== role);
            Object.values(guild.staffRoleList).forEach(staffRole => {
                if (staffRole.position > position) {
                    staffRole.position--;
                }
            });

            // Save the guild document
            await guild.save();

            const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[1].response.success', { role: staffRole.name });
            await interaction.reply({ content: content, ephemeral: true });
            return true;
        }
    }
    return false;
}

/**
 * List all staff roles
 * @param {*} interaction The interaction object
 */
async function listStaffRoles(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const staffRoles = guild.staffRoleList;

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[2].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return;
    }
    // Sort the roles by position
    // Highest position first
    staffRoles.sort((a, b) => b.position - a.position);

    // Get the role names from the guild document
    const roles = await interaction.guild.roles.fetch();

    // Create a list of roles with their positions
    const roleList = staffRoles.map(staffRole => {
        const role = roles.get(staffRole.roleID);
        if (!role) return client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[2].response.role_not_found', { roleName: staffRole.name, position: staffRole.position, slug: staffRole.name, roleID: staffRole.roleID });
        return client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[0].subcommands[2].response.success', { roleName: staffRole.name, role: role, position: staffRole.position, slug: staffRole.name, roleID: role.id, roleMemberCount: role.members.size });;
    });
    await interaction.reply({ content: roleList.join('\n'), ephemeral: true, allowedMentions: { repliedUser: false, roleMention: false }});
}

/**
 * Set the welcome channel
 * @param {*} channel The welcome channel
 * @param {*} interaction The interaction object
 * @returns If the channel was set successfully
 */
async function setWelcomeChannel(channel, interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[0].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Set the welcome channel
    guild.welcomeChannel = channel.id;

    // Save the guild document
    await guild.save();

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[0].response.success', { channel: channel });
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Set the message log channel
 * @param {*} channel The message log channel
 * @param {*} interaction The interaction object
 * @returns If the channel was set successfully
 */
async function setMessageLogChannel(channel, interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[1].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Set the message log channel
    guild.messageLogChannel = channel.id;

    // Save the guild document
    await guild.save();

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[1].response.success', { channel: channel });
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Set the moderation log channel
 * @param {*} channel The moderation log channel
 * @param {*} interaction The interaction object
 * @returns If the channel was set successfully
 */
async function setModLogChannel(channel, interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[2].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Set the moderation log channel
    guild.modLogChannel = channel.id;

    // Save the guild document
    await guild.save();

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[2].response.success', { channel: channel });
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Set the report channel
 * @param {*} channel The report channel
 * @param {*} interaction The interaction object
 * @returns If the channel was set successfully
 */
async function setReportChannel(channel, interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[3].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Set the report channel
    guild.reportChannel = channel.id;

    // Save the guild document
    await guild.save();

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[3].response.success', { channel: channel });
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Toggle the welcome message
 * @param {*} interaction The interaction object
 * @returns If the welcome message was toggled successfully
 */
async function toggleWelcomeMessage(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[4].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if a welcome channel is set
    if (!guild.welcomeChannel) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[4].response.no_channel');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Toggle the welcome message
    guild.welcomeEnabled = !guild.welcomeEnabled;

    // Save the guild document
    await guild.save();

    const key = guild.welcomeEnabled ? 'enabled' : 'disabled';
    const content = await client.translate(interaction.locale, 'commands', `manage.subcommand_groups[1].subcommands[4].response.${key}`);
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Toggle the message log
 * @param {*} interaction The interaction object
 * @returns If the message log was toggled successfully
 */
async function toggleMessageLog(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[5].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if a message log channel is set
    if (!guild.messageLogChannel) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[5].response.no_channel');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Toggle the message log
    guild.messageLogEnabled = !guild.messageLogEnabled;

    // Save the guild document
    await guild.save();

    const key = guild.messageLogEnabled ? 'enabled' : 'disabled';
    const content = await client.translate(interaction.locale, 'commands', `manage.subcommand_groups[1].subcommands[5].response.${key}`);
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Toggle the moderation log
 * @param {*} interaction The interaction object
 * @returns If the moderation log was toggled successfully
 */
async function toggleModLog(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[6].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if a moderation log channel is set
    if (!guild.modLogChannel) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[6].response.no_channel');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Toggle the moderation log
    guild.modLogEnabled = !guild.modLogEnabled;

    // Save the guild document
    await guild.save();

    const key = guild.modLogEnabled ? 'enabled' : 'disabled';
    const content = await client.translate(interaction.locale, 'commands', `manage.subcommand_groups[1].subcommands[6].response.${key}`);
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Toggle the report channel
 * @param {*} interaction The interaction object
 * @returns If the report channel was toggled successfully
 */
async function toggleReportChannel(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[7].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if a report channel is set
    if (!guild.reportChannel) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[7].response.no_channel');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Toggle the report channel
    guild.reportEnabled = !guild.reportEnabled;

    // Save the guild document
    await guild.save();

    const key = guild.reportEnabled ? 'enabled' : 'disabled';
    const content = await client.translate(interaction.locale, 'commands', `manage.subcommand_groups[1].subcommands[7].response.${key}`);
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Add a server link
 * @param {*} server The ID of the server to link
 * @param {*} interaction The interaction object
 * @returns If the server was linked successfully
 */
async function addServerLink(server, interaction) {
    const guildID = interaction.guild.id;

    // Check if the server ID is not the same as the current server
    if (server === guildID) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[8].response.same_server');
        await interaction.reply({ content: 'You can\'t link the server to itself!', ephemeral: true });
        return false;
    }

    const guild = await guildSchema.findOne({ guildID });
    const otherGuild = await guildSchema.findOne({ guildID: server });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[8].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if the other schema exists
    if (!otherGuild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[8].response.no_other_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check each guild's linked servers
    for (const link of guild.linkedGuilds) {
        if (link.guildID === server) {
            const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[8].response.already_linked');
            await interaction.reply({ content: content, ephemeral: true });
            return false;
        }
    }

    // Add the server to the linked servers
    guild.linkedGuilds.push({ guildID: server, relationship: 'staff' });

    // Add the current server to the other server's linked servers
    otherGuild.linkedGuilds.push({ guildID: guildID, relationship: 'main' });

    // Save both guild documents
    await guild.save();
    await otherGuild.save();

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[8].response.success', { server: server });
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}

/**
 * Remove a server link
 * @param {*} server The ID of the server to unlink
 * @param {*} interaction The interaction object
 * @returns If the server was unlinked successfully
 */
async function removeServerLink(server, interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });
    const otherGuild = await guildSchema.findOne({ guildID: server });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[9].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check if the other schema exists
    if (!otherGuild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[9].response.no_other_guild');
        await interaction.reply({ content: content, ephemeral: true });
        return false;
    }

    // Check each guild's linked servers
    for (const link of guild.linkedGuilds) {
        if (link.guildID === server) {
            // Remove the server from the linked servers
            guild.linkedGuilds = guild.linkedGuilds.filter(link => link.guildID !== server);

            // Remove the current server from the other server's linked servers
            otherGuild.linkedGuilds = otherGuild.linkedGuilds.filter(link => link.guildID !== guildID);

            // Save both guild documents
            await guild.save();
            await otherGuild.save();

            const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[9].response.success', { server: server });
            await interaction.reply({ content: content, ephemeral: true });
            return true;
        }
    }
    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[9].response.not_linked');
    await interaction.reply({ content: content, ephemeral: true });
    return false;
}

/**
 * Reset the server settings
 * @returns If the server settings were reset successfully
 */
async function resetServerSettings(interaction) {
    const guildID = interaction.guild.id;
    const guild = await guildSchema.findOne({ guildID });

    // Check if the schema exists
    if (!guild) {
        const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[10].response.no_guild');
        await interaction.reply({ content: content, ephemeral: true });
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

    const content = await client.translate(interaction.locale, 'commands', 'manage.subcommand_groups[1].subcommands[10].response.success');
    await interaction.reply({ content: content, ephemeral: true });
    return true;
}