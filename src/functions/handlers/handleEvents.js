const { readdirSync } = require('fs');
const { connection } = require('mongoose');

const handleClientEvents = (client, eventFiles) => {
    for (const file of eventFiles) {
        const event = require(`../../events/client/${file}`);
        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
        else client.on(event.name, (...args) => event.execute(...args, client));
    }
};

const handleMongoEvents = (client, eventFiles) => {
    for (const file of eventFiles) {
        const event = require(`../../events/mongo/${file}`);
        if (event.once) connection.once(event.name, (...args) => event.execute(...args, client));
        else connection.on(event.name, (...args) => event.execute(...args, client));
    }
};

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = readdirSync('./src/events');
        for (const folder of eventFolders) {
            const eventFiles = readdirSync(`./src/events/${folder}`).filter(file => file.endsWith('.js'));
            switch (folder) {
                case 'client':
                    handleClientEvents(client, eventFiles);
                    break;
                case 'mongo':
                    handleMongoEvents(client, eventFiles);
                    break;
                default:
                    break;
            }
        }
    };
};