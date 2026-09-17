import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { LanguageDropdown } from "@/presentation/components/language/LanguageDropdown";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon } from "@/presentation/components/ui/Icon";
import { colors, radii } from "@/presentation/theme/tokens";

export type AlertsStatus = "on" | "off" | "pending";

export function HomeHeader() {
    const { t } = useTranslation();

    return (
        <View className="flex-row items-center justify-between">
            <GlassSurface
                radius={radii.full}
                className="h-11 flex-row items-center gap-2 pl-1.5 pr-4"
            >
                <View
                    className="h-8 w-8 items-center justify-center rounded-full"
                    style={{
                        backgroundColor: colors.glow,
                        boxShadow: "0 0 12px rgba(27, 69, 255, 0.6)",
                    }}
                >
                    <Icon name="knight" size={16} />
                </View>
                <AppText variant="label">{t("app.title")}</AppText>
            </GlassSurface>

            <LanguageDropdown />
        </View>
    );
}
