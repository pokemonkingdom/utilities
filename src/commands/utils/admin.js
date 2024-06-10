const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const schemaPK = require('../../schemas/pkServer.js')
const schemaPKStaff = require('../../schemas/staffServer.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Comandos de Admins')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommandGroup(group => 
            group 
            .setName('rolestaff')
            .setDescription('Configura roles de Staff para interconectarlos')
            .addSubcommand(subcommand => 
                subcommand
                .setName('configurar')
                .setDescription('Agrega rol a la lista de roles')
                .addStringOption(option =>
                    option
                    .setName('servidor')
                    .setDescription('Elige en que servidor quieres configurar')
                    .setRequired(true)
                    .addChoices(
                        { name: 'PokémonKingdom', value: 'pk'},
                        { name: 'PokémonKingdomStaff', value: 'pkstaff'},
                    )
                )
                .addRoleOption(option => 
                    option
                    .setName('monarca')
                    .setDescription('Rol que encaje a esta opcion')
                    .setRequired(true)
                )
                .addRoleOption(option => 
                    option
                    .setName('duque')
                    .setDescription('Rol que encaje a esta opcion')
                    .setRequired(true)
                )
                .addRoleOption(option => 
                    option
                    .setName('consejeroreal')
                    .setDescription('Rol que encaje a esta opcion')
                    .setRequired(true)
                )
                .addRoleOption(option => 
                    option
                    .setName('guardareal')
                    .setDescription('Rol que encaje a esta opcion')
                    .setRequired(true)
                )
                .addRoleOption(option => 
                    option
                    .setName('escuderoreal')
                    .setDescription('Rol que encaje a esta opcion')
                    .setRequired(true)
                )
                .addRoleOption(option => 
                    option
                    .setName('bufonreal')
                    .setDescription('Rol que encaje a esta opcion')
                    .setRequired(true)
                )
            )
        )
        ,
    global: true,

    async execute(interaction, client) {

        if(interaction.options.getSubcommandGroup('rolestaff')) {

            if(interaction.options.getSubcommand('configurar')) {
                const monarca = await interaction.options.getRole('monarca')
                const duque = await interaction.options.getRole('duque')
                const consejeroreal = await interaction.options.getRole('consejeroreal')
                const guardareal = await interaction.options.getRole('guardareal')
                const escuderoreal = await interaction.options.getRole('escuderoreal')
                const bufonreal = await interaction.options.getRole('bufonreal')
                const servidor = await interaction.options.getString('servidor')
                if(servidor === 'pk') {
                    if(interaction.guild.id !== process.env.guildID) return await interaction.reply({ content: `Ejecuta en el servidor correcto, es decir Pokémon Kingdom`})
                    const data = await schemaPK.findOne({ idservidor: process.env.guildID })
                    if(!data) {

                        const rolesStaff = [
                        { nombre: monarca.name, id: monarca.id },
                        { nombre: duque.name, id: duque.id },
                        { nombre: consejeroreal.name, id: consejeroreal.id },
                        { nombre: guardareal.name, id: guardareal.id },
                        { nombre: escuderoreal.name, id: escuderoreal.id },
                        { nombre: bufonreal.name, id: bufonreal.id },
                        ];
                        
                        await schemaPK.create({
                            idservidor: interaction.guild.id,
                            nombreservidor: interaction.guild.name,
                            rolesStaff,
                        })
                        await interaction.reply({ content: `Se han guardado los datos de **${interaction.guild.name}**`})
                    } else if(data) {
                        //
                        await interaction.reply({ content: `Se ha editado los roles en la base de datos, estos roles son los que se han configurado en el servidor **${interaction.guild.name}**`})
                    }
                } 

                if(servidor === 'pkstaff') {
                    if(interaction.guild.id !== process.env.staffGuildID) return await interaction.reply({ content: `Ejecuta en el servidor correcto, es decir Pokémon Kingdom`})
                    const data = await schema.findOne({ Servidor: process.env.staffGuildID })
                    if(!data) {
                        await schema.create({
                            Servidor: interaction.guild.id,
                            Monarca: monarca.id,
                            Duque: duque.id,
                            ConsejeroReal: consejeroreal.id,
                            GuardaReal: guardareal.id,
                            EscuderoReal:escuderoreal.id,
                            BufonReal: bufonreal.id,
                        })
                        await interaction.reply({ content: `Se han guardado los datos de **${interaction.guild.name}**`})
                    } else if(data) {
                        data.Monarca = monarca.id
                        data.Duque = duque.id
                        data.ConsejeroReal = consejeroreal.id
                        data.GuardaReal = guardareal.id
                        data.EscuderoReal = escuderoreal.id
                        data.BufonReal = bufonreal.id
                        await data.save()
                        await interaction.reply({ content: `Se ha editado los roles en la base de datos, estos roles son los que se han configurado en el servidor principal **${interaction.guild.name}**`})
                    }
                }  
            }
        }
    }
}