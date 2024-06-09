const { readdirSync, readFileSync } = require('fs');
const path = require('path');

// Language mapping for certain languages
const languageMapping = {
    'en-GB': 'en',
    'en-US': 'en',
    'es-ES': 'es',
    'es-419': 'es'
};

const locales = {};
const commandDescriptions = {};

module.exports = (client) => {
    client.handleLocales = async () => {
        const localePath = path.join(__dirname, '../../locales');
        const localeFiles = readdirSync(localePath);

        localeFiles.forEach(file => {
            const filePath = path.join(localePath, file);
            const localeName = path.basename(file, path.extname(file));
            const localeData = JSON.parse(readFileSync(filePath, 'utf-8'));

            // Initialize locale data
            commandDescriptions[localeName] = {};

            // Load command translations
            if (localeData.commands) {
                Object.entries(localeData.commands).forEach(([command, commandData]) => {
                    // Store command translations in map
                    commandDescriptions[localeName][command] = commandData.description;
                });
            }

            locales[localeName] = localeData;
        });
    };

    client.translate = (locale, category, key, replacements = {}) => {
        // Get the parent language if the locale is a specific region
        locale = getParentLanguage(locale);

        // Get the locale translations
        const localeTranslations = locales[locale];
        if (!localeTranslations) return null;
        // Get the category translations
        const categoryTranslations = localeTranslations[category];
        if (!categoryTranslations) return null;

        // Split key into nested levels
        const nestedKeys = key.split(/\.|\[/);
        let translation = categoryTranslations;
        for (const key of nestedKeys) {
            const trimmedKey = key.replace(']', '');

            if (Array.isArray(translation)) {
                // Check if key is a number
                const index = parseInt(trimmedKey);
                translation = translation[index];
            } else {
                translation = translation[trimmedKey];
            }

            if (!translation) return null;
        }

        // Replace placeholders in the translation
        let translatedText = translation;
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translatedText = translatedText.replace(new RegExp(`%${placeholder}%`, 'g'), value);
        });

        return translatedText;
    }

    client.translateCommand = async (data, command, attribute) => {
        const chalkInstance = await import('chalk');
        const chalk = chalkInstance.default;

        // Create array of possible locales that Discord uses
        const locales = ['id', 'da', 'de', 'en-GB', 'en-US', 'es-ES', 'es-419', 'fr', 'hr', 'it', 'lt', 'hu', 'nl', 'no', 'pl', 'pt-BR', 'ro', 'fi', 'sv-SE', 'vi', 'tr', 'cs', 'el', 'bg', 'ru', 'uk', 'hi', 'th', 'zh-CN', 'ja', 'zh-TW', 'ko'];

        const translations = {}

        // Iterate through each locale
        for (const locale of locales) {
            const translation = client.translate(locale, 'commands', `${command}.${attribute}`);
            if (translation) {
                translations[locale] = translation;
            }
        }

        if (attribute === 'name') {
            try {
                data.setNameLocalizations(translations);                
            } catch (e) {
                console.log(chalk.redBright(`[Command Handler] Error setting name localizations for ${command}`));
                console.error(e);
            }
        } else if (attribute === 'description') {
            try {
                data.setDescriptionLocalizations(translations);
            } catch (e) {
                console.log(chalk.redBright(`[Command Handler] Error setting description localizations for ${command}`));
                console.error(e);
            }
        }
    }
}

const getParentLanguage = (locale) => {
    return languageMapping[locale] || locale;
}
