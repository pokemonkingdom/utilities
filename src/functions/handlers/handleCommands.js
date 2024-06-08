const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { readdirSync } = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const chalkInstance = await import('chalk');
        const chalk = chalkInstance.default;

        client.commands = new Map();
        client.guildCommands = [];
        client.staffGuildCommands = [];
        client.globalCommands = [];

        const commandFolders = readdirSync('./src/commands');

        // Folder debug variables
        const commandFolderCount = commandFolders.length;
        let currentCommandFolder = 1;

        for (const folder of commandFolders) {
            const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

            // Command debug variables
            const commandFileCount = commandFiles.length;
            let currentCommandFile = 1;

            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);

                // If the command is global, set it in the globalCommands collection
                if (command.global) {
                    client.globalCommands.push(command.data.toJSON());
                    console.log(chalk.greenBright(`Global command ${command.data.name} loaded`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                } else {
                    if (!command.guildID) {
                        console.error(chalk.bgRedBright(`Command ${command.data.name} does not have a guildID set!`));
                        console.log(chalk.redBright(`Command ${command.data.name} failed to load`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                        continue;
                    }

                    switch (command.guildID) {
                        case `${process.env.mainGuildID}`:
                            client.guildCommands.push(command.data.toJSON());
                            console.log(chalk.greenBright(`Guild command ${command.data.name} loaded`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                            break;
                        case `${process.env.staffGuildID}`:
                            client.staffGuildCommands.push(command.data.toJSON());
                            console.log(chalk.greenBright(`Staff guild command ${command.data.name} loaded`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                            break;
                        default:
                            console.error(chalk.bgRedBright(`Command ${command.data.name} has an invalid guildID set!`));
                            console.log(chalk.redBright(`Command ${command.data.name} failed to load`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                            break;
                    }
                }
                currentCommandFile++;
            }
            currentCommandFolder++;
        }

        const clientID = `${process.env.clientID}`;
        const rest = new REST({ version: '10' }).setToken(process.env.token);

        try {
            console.log(chalk.gray('Started refreshing global application (/) commands.'));
            await rest.put(
                Routes.applicationCommands(clientID), { 
                    body: client.globalCommands
                },
            );

            console.log(chalk.gray('Started refreshing guild (/) commands.'));
            await rest.put(
                Routes.applicationGuildCommands(clientID, process.env.guildID), {
                    body: client.guildCommands
                },
            );

            console.log(chalk.gray('Started refreshing staff guild (/) commands.'));
            await rest.put(
                Routes.applicationGuildCommands(clientID, process.env.staffGuildID), {
                    body: client.staffGuildCommands
                },
            );

            console.log(chalk.greenBright('Successfully reloaded application (/) commands.'));
        } catch (e) {
            console.error(e);
        }
    }
}