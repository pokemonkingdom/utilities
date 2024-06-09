const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { translate } = require('../../functions/handlers/handleLocales');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s ping'),
    global: true,
    async autocomplete(interaction, client) {
        // Get user's locale
        const locale = interaction.locale || 'en'; // Default to English if locale not available

        // Fetch translations
        const name = translate(locale, 'commands', 'ping.name');
        const description = translate(locale, 'commands', 'ping.description');

        this.data.setName(name);
        this.data.setDescription(description);
    },
    async execute(interaction, client) {
        const message = await interaction.deferReply({ content: 'Pinging...', fetchReply: true });

        // Get user's locale and calculate ping
        const locale = interaction.locale;
        const ping = message.createdTimestamp - interaction.createdTimestamp;

        // Fetch translations
        const field1name = client.translate(locale, 'commands', 'ping.response.fields[0].name');
        const field2name = client.translate(locale, 'commands', 'ping.response.fields[1].name');
        const footer = client.translate(locale, 'commands', 'ping.response.footer', { user: interaction.user.username });

        // Build and send embed
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .addFields(
                { name: `${field1name}`, value: `${ping}ms`, inline: true },
                { name: `${field2name}`, value: `${client.ws.ping}ms`, inline: true })
            .setColor('Blurple')
            .setFooter({ text: `/ping | ${footer}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
}