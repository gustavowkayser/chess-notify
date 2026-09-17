import { getLocales } from "expo-localization";
import { getItemAsync, setItemAsync } from "expo-secure-store";

const LANGUAGE_KEY = "app_language";

export type SupportedLanguage = "en" | "pt" | "es";

export interface LanguageOption {
    code: SupportedLanguage;
    label: string;
    nativeName: string;
    flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    { code: "en", label: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "pt", label: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
    { code: "es", label: "Spanish", nativeName: "Español", flag: "🇪🇸" },
];

/**
 * Detects the device language and matches it to a supported language.
 * Defaults to "en" if unsupported.
 */
export function getDeviceLanguage(): SupportedLanguage {
    try {
        const locales = getLocales();
        const primaryLocale = locales?.[0];
        const code = primaryLocale?.languageCode?.toLowerCase() ?? "";

        if (code.startsWith("pt")) {
            return "pt";
        }
        if (code.startsWith("es")) {
            return "es";
        }
        if (code.startsWith("en")) {
            return "en";
        }

        return "en";
    } catch {
        return "en";
    }
}

/**
 * Retrieves the user-selected language preference from secure storage.
 * Returns null if none is saved, indicating device default should be used.
 */
export async function getSavedLanguage(): Promise<SupportedLanguage | null> {
    try {
        const value = await getItemAsync(LANGUAGE_KEY);
        if (value === "en" || value === "pt" || value === "es") {
            return value;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Saves the selected language to secure storage.
 */
export async function setSavedLanguage(
    language: SupportedLanguage,
): Promise<void> {
    try {
        await setItemAsync(LANGUAGE_KEY, language);
    } catch {
        // Fallback silently if storage unavailable
    }
}
