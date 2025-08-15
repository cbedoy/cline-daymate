import es from './es.js';
import en from './en.js';

const translations = { es, en };
let currentLanguage = localStorage.getItem('language') || 'es';

export const setLanguage = (lang) => {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        translatePage();
    }
};

export const getLanguage = () => currentLanguage;

export const t = (key, options = {}) => {
    let translation = translations[currentLanguage][key] || key;
    Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, options[optionKey]);
    });
    return translation;
};

export const translatePage = () => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
};
