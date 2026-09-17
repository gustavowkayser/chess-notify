import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "@/infrastructure/i18n/i18n";
import {
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from "@/infrastructure/storage/languagePreference";

export function useLanguage() {
    const { t, i18n } = useTranslation();
    const currentLanguage = (i18n.language?.slice(0, 2) ||
        "en") as SupportedLanguage;

    const changeLanguage = useCallback(async (lang: SupportedLanguage) => {
        await setAppLanguage(lang);
    }, []);

    const currentOption =
        SUPPORTED_LANGUAGES.find((opt) => opt.code === currentLanguage) ??
        SUPPORTED_LANGUAGES[0];

    return {
        t,
        currentLanguage,
        currentOption,
        languages: SUPPORTED_LANGUAGES,
        changeLanguage,
    };
}
