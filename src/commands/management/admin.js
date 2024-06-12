const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        await interaction.reply('Working on it! 🛠️ (soon™)');
    }
}