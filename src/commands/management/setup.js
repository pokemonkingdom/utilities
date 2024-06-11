const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the bot in your server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildID: interaction.guild.id });
        if (guildProfile) return interaction.reply({ content: `Server with ID ${interaction.guild.id} is already in the database.` });

        await interaction.reply({ content: `Creating database entry for server ${interaction.guild.id}...` });
        guildProfile = new Guild({
            _id: new mongoose.Types.ObjectId(),
            guildID: interaction.guild.id,
            guildName: interaction.guild.name,
        });

        await interaction.editReply({ content: 'Saving data...' });
        await guildProfile.save();
        return interaction.editReply({ content: `Initial setup done for ${interaction.guild.id}.\nRemember to use \`/manage\`!` });
    }
}