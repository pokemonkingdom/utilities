const { InteractionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            chatInputCommand(interaction, client);
        } else if (interaction.isButton()) {
            button(interaction, client);
        } else if (interaction.isSelectMenu()) {
            selectMenu(interaction, client);
        } else if (interaction.isContextMenuCommand()) {
            contextMenu(interaction, client);
        } else if (interaction.type == InteractionType.ModalSubmit) {
            modalSubmit(interaction, client);
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            autocomplete(interaction, client);
        }
    }
};

const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription('An error occurred while executing this command, below is the error message. Please report this to the bot developer.')
            .setColor('Red');

async function chatInputCommand(interaction, client) {
    const { commands } = client;
    const { commandName } = interaction;
    const command = commands.get(commandName);
    if (!command) return new Error('Command not found');

    try {
        await command.execute(interaction, client);
        return true;
    } catch (e) {
        console.error(e);
        errorEmbed.addFields(
            {
                name: 'Error Message',
                value: e.message
            },
            {
                name: 'Error Stack',
                value: e.stack
            }
        );
        errorEmbed.setFooter({ text: `ERR_INT_CH_INP - Error in command ${commandName}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return false;
    }
}

async function button(interaction, client) {
    const { buttons } = client;
    const { customId } = interaction;
    const button = buttons.get(customId);
    if (!button) return new Error('Button not found');

    try {
        await button.execute(interaction, client);
        return true;
    } catch (e) {
        console.error(e);
        errorEmbed.addFields(
            {
                name: 'Error Message',
                value: e.message
            },
            {
                name: 'Error Stack',
                value: e.stack
            }
        );
        errorEmbed.setFooter({ text: `ERR_INT_BTN - Error in button ${customId}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return false;
    }
}

async function selectMenu(interaction, client) {
    const { selectMenus } = client;
    const { customId } = interaction;
    const menu = selectMenus.get(customId);
    if (!menu) return new Error('Select menu not found');

    try {
        await menu.execute(interaction, client);
        return true;
    } catch (e) {
        console.error(e);
        errorEmbed.addFields(
            {
                name: 'Error Message',
                value: e.message
            },
            {
                name: 'Error Stack',
                value: e.stack
            }
        );
        errorEmbed.setFooter({ text: `ERR_INT_SEL - Error in select menu ${customId}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return false;
    }
}

async function contextMenu(interaction, client) {
    const { commands } = client;
    const { commandName } = interaction.commandName;
    const contextCommand = commands.get(commandName);
    if (!contextCommand) return new Error('Command not found');

    try {
        await contextCommand.execute(interaction, client);
        return true;
    } catch (e) {
        console.error(e);
        errorEmbed.addFields(
            {
                name: 'Error Message',
                value: e.message
            },
            {
                name: 'Error Stack',
                value: e.stack
            }
        );
        errorEmbed.setFooter({ text: `ERR_INT_CTX - Error in context command ${commandName}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return false;
    }
}

async function modalSubmit(interaction, client) {
    const { modals } = client;
    const { customId } = interaction;
    const modal = modals.get(customId);
    if (!modal) return new Error('Modal not found');

    try {
        await modal.execute(interaction, client);
        return true;
    } catch (e) {
        console.error(e);
        errorEmbed.addFields(
            {
                name: 'Error Message',
                value: e.message
            },
            {
                name: 'Error Stack',
                value: e.stack
            }
        );
        errorEmbed.setFooter({ text: `ERR_INT_MOD - Error in modal ${customId}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return false;
    }
}

async function autocomplete(interaction, client) {
    const { commands } = client;
    const { commandName } = interaction;
    const command = commands.get(commandName);
    if (!command) return new Error('Command not found');

    try {
        await command.autocomplete(interaction, client);
        return true;
    } catch (e) {
        console.error(e);
        errorEmbed.addFields(
            {
                name: 'Error Message',
                value: e.message
            },
            {
                name: 'Error Stack',
                value: e.stack
            }
        );
        errorEmbed.setFooter({ text: `ERR_INT_AUT - Error in autocomplete ${commandName}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return false;
    }
}