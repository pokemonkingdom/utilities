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

        // Get the category translations
        const categoryTranslations = locales[locale][category];
        if (!categoryTranslations) return `Category ${category} not found for locale ${locale}`;

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

            if (!translation) return `Key ${trimmedKey} not found in category ${category} for locale ${locale}`;
        }

        // Replace placeholders in the translation
        let translatedText = translation;
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translatedText = translatedText.replace(new RegExp(`%${placeholder}%`, 'g'), value);
        });

        return translatedText;
    }
}

const getParentLanguage = (locale) => {
    return languageMapping[locale] || locale;
}
