const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Comandos de Admins')
        .addSubcommandGroup(group => 
            group 
            .setName('configrolestaff')
            .setDescription('Configura roles de Staff para interconectarlos')
            .addSubcommand(subcommand => 
                subcommand
                .setName('agregar')
                .setDescription('Agrega rol a la lista de roles')
                .addRoleOption(option => 
                    option
                    .setName('rol')
                    .setDescription('Rol que deseas agregar')
                )
            )
            .addSubcommand(subcommand => 
                subcommand
                .setName('remover')
                .setDescription('remueve rol a la lista de roles')
                .addRoleOption(option => 
                    option
                    .setName('rol')
                    .setDescription('Rol que deseas remover')
                )
            )
        )
        ,
    global: true,

    async execute(interaction, client) {
        
    }
}