const { readdirSync, readFileSync } = require('fs');
const path = require('path');

// Language mapping for certain languages
const languageMapping = {
    'en-GB': 'en',
    'en-US': 'en',
    'es-ES': 'es',
    'es-419': 'es'
};

const discordLocales = ['id', 'da', 'de', 'en-GB', 'en-US', 'es-ES', 'es-419', 'fr', 'hr', 'it', 'lt', 'hu', 'nl', 'no', 'pl', 'pt-BR', 'ro', 'fi', 'sv-SE', 'vi', 'tr', 'cs', 'el', 'bg', 'ru', 'uk', 'hi', 'th', 'zh-CN', 'ja', 'zh-TW', 'ko'];

const locales = {};

// Load locale files
const localePath = path.join(__dirname, '../../locales');
const localeFiles = readdirSync(localePath);

localeFiles.forEach(file => {
    const filePath = path.join(localePath, file);
    const localeName = path.basename(file, path.extname(file));
    const localeData = JSON.parse(readFileSync(filePath, 'utf-8'));
    locales[localeName] = localeData;
});

const getParentLanguage = (locale) => {
    return languageMapping[locale] || locale;
};

const translate = (locale, category, key, replacements = {}) => {
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
    const translation = getNestedTranslation(categoryTranslations, nestedKeys);
    if (!translation) return null;

    // Replace placeholders in the translation
    let translatedText = translation;
    Object.entries(replacements).forEach(([placeholder, value]) => {
        translatedText = translatedText.replace(new RegExp(`%${placeholder}%`, 'g'), value);
    });

    return translatedText;
};

const getNestedTranslation = (translations, nestedKeys) => {
    let translation = translations;
    for (const key of nestedKeys) {
        const trimmedKey = key.replace(']', '');
        if (Array.isArray(translation)) {
            const index = parseInt(trimmedKey);
            translation = translation[index];
        } else {
            translation = translation[trimmedKey];
        }

        if (!translation) return null;
    }

    return translation;
};

const translateAttribute = async (command, attribute) => {
    const translations = {};

    for (const locale of discordLocales) {
        const translation = translate(locale, 'commands', `${command}.${attribute}`);
        if (translation) {
            translations[locale] = translation;
        }
    }

    return translations;
};

module.exports = translateAttribute;