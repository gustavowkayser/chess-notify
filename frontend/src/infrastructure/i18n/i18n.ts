import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
    getDeviceLanguage,
    getSavedLanguage,
    type SupportedLanguage,
    setSavedLanguage,
} from "@/infrastructure/storage/languagePreference";
import en from "./locales/en.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";

export const defaultLanguage: SupportedLanguage = "en";

export const resources = {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
} as const;

// Default immediately to the device language
const initialLanguage = getDeviceLanguage();

i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: initialLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
        escapeValue: false,
    },
});

// If the user previously chose a specific language, apply it
getSavedLanguage().then((savedLanguage) => {
    if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
    }
});

/**
 * Changes the active language and saves the user preference.
 */
export async function setAppLanguage(
    language: SupportedLanguage,
): Promise<void> {
    await i18n.changeLanguage(language);
    await setSavedLanguage(language);
}

export default i18n;
