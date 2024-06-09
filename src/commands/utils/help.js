const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with using the bot'),
    global: true,
    async execute(interaction, client) {
        const locale = interaction.locale;

        const title = client.translate(locale, 'commands', 'help.response.title') || client.translate('en', 'commands', 'help.response.title');
        const description = client.translate(locale, 'commands', 'help.response.description') || client.translate('en', 'commands', 'help.response.description');
        const fields = client.translate(locale, 'commands', 'help.response.fields') || client.translate('en', 'commands', 'help.response.fields');
        const footer = client.translate(locale, 'commands', 'help.response.footer', { user: interaction.user.username }) || client.translate('en', 'commands', 'help.response.footer', { user: interaction.user.username });

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(fields)
            .setColor('Blurple')
            .setFooter({ text: `/help | ${footer}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}