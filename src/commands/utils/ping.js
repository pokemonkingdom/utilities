const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency'),
    global: true,
    async execute(interaction, client) {
        const message = await interaction.deferReply({ content: 'Pinging...', fetchReply: true });
        const ping = message.createdTimestamp - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .addFields(
                { name: 'Bot Latency', value: `${ping}ms`, inline: true },
                { name: 'API Latency', value: `${client.ws.ping}ms`, inline: true })
            .setColor('Blurple')
            .setFooter({ text: `/ping | ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
}