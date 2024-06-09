const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { readdirSync } = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const chalkInstance = await import('chalk');
        const chalk = chalkInstance.default;

        const { commands, guildCommands, staffGuildCommands, globalCommands } = client;

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
                try {
                    const command = require(`../../commands/${folder}/${file}`);
                    commands.set(command.data.name, command);

                    // If the command is global, set it in the globalCommands collection
                    if (command.global) {
                        // Translate the command's name and description
                        client.translateCommand(command.data, command.data.name, 'name');
                        client.translateCommand(command.data, command.data.name, 'description');

                        globalCommands.push(command.data.toJSON());
                        console.log(chalk.greenBright(`Global command ${command.data.name} loaded`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                    } else {
                        if (!command.guildID) {
                            console.error(chalk.bgRedBright(`Command ${command.data.name} does not have a guildID set!`));
                            console.log(chalk.redBright(`Command ${command.data.name} failed to load`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                            continue;
                        }

                        switch (command.guildID) {
                            case `${process.env.mainGuildID}`:
                                // Translate the command's name and description
                                client.translateCommand(command.data, command.data.name, 'name');
                                client.translateCommand(command.data, command.data.name, 'description');

                                guildCommands.push(command.data.toJSON());
                                console.log(chalk.greenBright(`Guild command ${command.data.name} loaded`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                                break;
                            case `${process.env.staffGuildID}`:
                                // Translate the command's name and description
                                client.translateCommand(command.data, command.data.name, 'name');
                                client.translateCommand(command.data, command.data.name, 'description');

                                staffGuildCommands.push(command.data.toJSON());
                                console.log(chalk.greenBright(`Staff guild command ${command.data.name} loaded`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                                break;
                            default:
                                console.error(chalk.bgRedBright(`Command ${command.data.name} has an invalid guildID set!`));
                                console.log(chalk.redBright(`Command ${command.data.name} failed to load`) + ` (${currentCommandFile}/${commandFileCount}) | (${currentCommandFolder}/${commandFolderCount})`);
                                break;
                        }
                    }
                    currentCommandFile++;
                } catch (e) {
                    console.error(`Error requiring file ${file} in ${folder}: ${e}`);
                }
            }
            currentCommandFolder++;
        }

        const clientID = `${process.env.clientID}`;
        const rest = new REST({ version: '10' }).setToken(process.env.token);

        try {
            console.log(chalk.gray('Started refreshing global application (/) commands.'));
            await rest.put(
                Routes.applicationCommands(clientID), {
                body: globalCommands
            },
            );

            console.log(chalk.gray('Started refreshing guild (/) commands.'));
            await rest.put(
                Routes.applicationGuildCommands(clientID, process.env.guildID), {
                body: guildCommands
            },
            );

            console.log(chalk.gray('Started refreshing staff guild (/) commands.'));
            await rest.put(
                Routes.applicationGuildCommands(clientID, process.env.staffGuildID), {
                body: staffGuildCommands
            },
            );

            console.log(chalk.greenBright('Successfully reloaded application (/) commands.'));
        } catch (e) {
            console.error(e);
        }
    }
}